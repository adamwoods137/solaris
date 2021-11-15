const FIRST_TICK_BULK_UPGRADE_SCI_PERCENTAGE = 20;
const FIRST_TICK_BULK_UPGRADE_IND_PERCENTAGE = 30;
const LAST_TICK_BULK_UPGRADE_ECO_PERCENTAGE = 100;

const Heap = require('qheap');
const { getOrInsert, minBy, minElementBy } = require('../utils.js')

module.exports = class AIService {
    constructor(starUpgradeService, carrierService, starService, distanceService, waypointService) {
        this.starUpgradeService = starUpgradeService;
        this.carrierService = carrierService;
        this.starService = starService;
        this.distanceService = distanceService;
        this.waypointService = waypointService;
    }

    async play(game, player) {
        if (!player.defeated) {
            throw new Error('The player is not under AI control.');
        }

        const isFirstTick = game.state.tick % game.settings.galaxy.productionTicks === 1;
        const isLastTick = game.state.tick % game.settings.galaxy.productionTicks === game.settings.galaxy.productionTicks - 1;

        await this._doAdvancedLogic(game, player, isFirstTick, isLastTick);

        await this._doBasicLogic(game, player, isFirstTick, isLastTick);
    }

    async _doBasicLogic(game, player, isFirstTick, isLastTick) {
        try {
            if (isFirstTick) {
                await this._playFirstTick(game, player);
            } else if (isLastTick) {
                await this._playLastTick(game, player);
            }
        } catch (e) {
            console.error(e);
        }

        // TODO: Not sure if this is an issue but there was an occassion during debugging
        // where the player credits amount was less than 0, I assume its the AI spending too much somehow
        // so adding this here just in case but need to investigate.
        player.credits = Math.max(0, player.credits);
    }

    async _doAdvancedLogic(game, player, isFirstTick, isLastTick) {
        // Considering the growing complexity of AI logic, 
        // it's better to catch any possible errors and have the game continue with disfunctional AI than to break the game tick logic.
        try {
            if (isFirstTick || !player.ai) {
                await this._setupAi(game, player);
                player.ai = true;
            }
            const context = this._createContext(game, player);
            const orders = await this._gatherOrders(game, player, context);
            const assignments = await this._gatherAssignments(game, player, context);
            await this._evaluateOrders(game, player, context, orders, assignments);
            player.markModified('aiState');
            player.save();
        } catch (e) {
            console.error(e);
        }
    }

    async _setupAi(game, player) {
        player.aiState = {
            knownAttacks: [],
            startedInvasions: []
        }
    }

    async _createContext(game, player) {
        const playerStars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, player._id);

        const starsById = new Map()

        for (const star of galaxy.stars) {
            starsById.set(star._id.toString(), star);
        }

        const reachableStars = this._computeStarGraph(game, player, playerStars, game.stars);
        const reachablePlayerStars = this._computeStarGraph(game, player, playerStars, playerStars);
        const borderStars = [];
        for (const [from, reachables] of reachableStars) {
            for (const reachableId of reachables) {
                const reachable = starsById.get(reachableId);
                if (!reachable.ownedByPlayerId) {
                    borderStars.push(from);
                }
            }
        }

        return {
            playerStars,
            starsById,
            reachableStars,
            reachablePlayerStars,
            borderStars
        }
    }

    async _evaluateOrders(game, player, context, orders, assignments) {

    }

    async _gatherAssignments(game, player, context) {

    }

    async _gatherOrders(game, player, context) {
        const defenseOrders = this._gatherDefenseOrders(game, player, context);
        //For now, just expand to unowned stars. Later, we will launch attacks on other players.
        const expansionOrders = this._gatherExpansionOrders(game, player, context);
        const movementOrders = await this._gatherMovementOrders(game, player, context);
        return defenseOrders.concat(expansionOrders, movementOrders);
    }

    _gatherExpansionOrders(game, player, context) {
        const orders = [];

        for (const [fromIdx, reachables] of context.reachableStars) {
            const claimCandidates = reachables.filter(star => !star.ownedByPlayerId);
            const fromId = context.playerStars[fromIdx]._id;
            for (const candidate of claimCandidates) {
                orders.push({
                    type: 'CLAIM_STAR',
                    score: candidate.naturalResources,
                    star: candidate._id,
                    from: fromId
                });
            }
        }

        return orders;
    }

    _gatherDefenseOrders(game, player, context) {
        // Find all of our stars that are under attack
        const incomingCarriers = game.galaxy.carriers
            .filter(carrier => carrier.ownedByPlayerId.toString() !== player._id.toString())
            .map(carrier => [carrier, carrier.waypoints.find(wp => context.starsById.has(wp.destination.toString()))])
            .filter(incoming => Boolean(incoming[1]))

        const starsUnderAttack = new Map();

        for (const [incomingCarrier, incomingWaypoint] of incomingCarriers) {
            const targetStar = incomingWaypoint.destination.toString();
            const attacks = getOrInsert(starsUnderAttack, targetStar, () => new Map());
            const attackInTicks = this.waypointService.calculateWaypointTicksEta(game, incomingCarrier, incomingWaypoint);
            const simultaneousAttacks = getOrInsert(attacks, attackInTicks, () => []);
            simultaneousAttacks.push(incomingCarrier);
        }

        const orders = new Array(starsUnderAttack.size);

        for (const [attackedStarId, attacks] of starsUnderAttack) {
            for (const [attackInTicks, incomingCarriers] of attacks) {
                const attackedStar = context.starsById.get(attackedStarId);
                const starScore = attackedStar.infrastructure.economy + 2 * attackedStar.infrastructure.industry + 3 * attackedStar.infrastructure.science;

                orders.push({
                    type: 'DEFEND_STAR',
                    score: starScore,
                    star: attackedStarId,
                    ticksUntil: attackInTicks,
                    incomingCarriers
                })
            }
        }

        return orders;
    }

    async _gatherMovementOrders(game, player, context) {
        //TODO: Let ships flow towards the border
    }

    _computeExistingLogisticsGraph(game, player) {
        const loopedCarriers = this.carrierService.listCarriersOwnedByPlayer(game.galaxy.carriers, player._id).filter(c => c.waypointsLooped && c.waypoints && c.waypoints.length === 2);

        const graph = new Map();

        for (let carrier of loopedCarriers) {
            const fromWaypoint = carrier.waypoints.find(waypoint => waypoint.action === "collectAll");
            const toWaypoint = carrier.waypoints.find(waypoint => waypoint.action === "dropAll");
            if (fromWaypoint && toWaypoint) {
                const from = fromWaypoint.destination.toString();
                const to = toWaypoint.destination.toString();
                const destinations = getOrInsert(graph, from, () => new Map());
                destinations.set(to, carrier);
            }
        }

        return graph;
    }

    _computeStarGraph(game, player, playerStars, starCandidates) {
        const hyperspaceRange = this.distanceService.getHyperspaceDistance(game, player.research.hyperspace.level);
        const hyperspaceRangeSquared = hyperspaceRange * hyperspaceRange;

        const starGraph = new Map();

        playerStars.forEach((star, starIdx) => {
            const reachableStars = new Set();

            starCandidates.forEach((otherStar, otherStarIdx) => {
                if (starIdx !== otherStarIdx && this.distanceService.getDistanceSquaredBetweenLocations(star.location, otherStar.location) <= hyperspaceRangeSquared) {
                    reachableStars.add(otherStar._id);
                }
            });

            starGraph.set(star._id, reachableStars);
        });

        return starGraph;
    }

    // logisticsGraph: Map<String, Set<String>>; existingGraph: Map<String, Map<String, String>>
    _createCarrierOrders(logisticsGraph, existingGraph) {
        const orders = new Array();

        for (let [ from, destinations ] of logisticsGraph) {
            const existingDestinations = existingGraph.get(from) || new Map();

            for (let to of destinations) {
                if (!existingDestinations.has(to)) {
                    orders.push({
                        orderType: 'CREATE_CARRIER_LOOP',
                        data: {
                            from,
                            to
                        }
                    });
                } else {
                    existingDestinations.delete(to);
                }
            }
        }

        for (let [ _from, oldDestinations ] of existingGraph) {
            for (let [ _to, carrier ] of oldDestinations) {
                carrier.waypointsLooped = false;
            }
        }

        return orders;
    }

    _computeStarScores(game, player, playerStars, starGraph) {
        const enemyStars = game.galaxy.stars.filter(star => star.ownedByPlayerId && !star.ownedByPlayerId.equals(player._id));

        const scoreMap = new Map();

        for (let [ starIndex, _ ] of starGraph) {
            const star = playerStars[starIndex];
            const distanceToClosestEnemyStar = minBy(es => this.distanceService.getDistanceSquaredBetweenLocations(es.location, star.location), enemyStars);
            const score = 100 / distanceToClosestEnemyStar;

            scoreMap.set(starIndex, score);
        }

        return scoreMap;
    }

    _createStarQueue(scoreMap) {
        const queue = new Heap({
            comparBefore: (b1, b2) => b1.score < b2.score,
            compar: (b1, b2) => b1.score - b2.score
        });

        for (let [ starIndex, score ] of scoreMap) {
            queue.insert({
                starIndex,
                score
            })    
        }

        return queue;
    }

    _createLogisticsGraph(game, player, starGraph, playerStars) {
        const starScores = this._computeStarScores(game, player, playerStars, starGraph);
        const starQueue = this._createStarQueue(starScores);
        const logisticsGraph = new Map();
        
        while (starQueue.length != 0) {
            const highestScoredItem = starQueue.dequeue();
            const nextConnection = this._findNextConnection(logisticsGraph, starGraph, starScores, highestScoredItem.starIndex);
            if (nextConnection) {
                const newScore = highestScoredItem.score * 0.5;
                starScores.set(highestScoredItem.starIndex, newScore);
                const from = playerStars[nextConnection.from]._id.toString();
                const to = playerStars[nextConnection.to]._id.toString();
                const connections = getOrInsert(logisticsGraph, from, () => new Set());
                connections.add(to);
            }
        }

        return logisticsGraph;
    }

    _findNextConnection(logisticsGraph, starGraph, starScores, starIndex) {
        const candidates = new Set();

        this._findConnectables(logisticsGraph, starGraph, starIndex, candidates, new Set());

        const starScore = starScores.get(starIndex);
        const lowerConnections = Array.from(candidates).filter(c => starScores.get(c.from) < starScore);
        return minElementBy((connection) => starScores.get(connection.from), lowerConnections)
    }

    _findConnectables(logisticsGraph, starGraph, start, connectables, visited) {
        const inRange = starGraph.get(start);
        const connected = logisticsGraph.get(start);
        visited.add(start);

        for (let c of inRange) {
            if (visited.has(c)) {
                continue;
            } else {
                if (connected && connected.has(c)) {
                    this._findConnectables(logisticsGraph, starGraph, c, connectables, visited);
                } else {
                    connectables.add({
                        to: start,
                        from: c
                    });
                }
            }            
        }
    }

    async _playFirstTick(game, player) {
        if (!player.credits || player.credits < 0) {
            return
        }

        // On the first tick after production:
        // 1. Bulk upgrade X% of credits to ind and sci.
        let creditsToSpendSci = Math.floor(player.credits / 100 * FIRST_TICK_BULK_UPGRADE_SCI_PERCENTAGE);
        let creditsToSpendInd = Math.floor(player.credits / 100 * FIRST_TICK_BULK_UPGRADE_IND_PERCENTAGE);

        if (creditsToSpendSci) {
            await this.starUpgradeService.upgradeBulk(game, player, 'totalCredits', 'science', creditsToSpendSci, false);
        }

        if (creditsToSpendInd) {
            await this.starUpgradeService.upgradeBulk(game, player, 'totalCredits', 'industry', creditsToSpendInd, false);
        }
    }

    async _playLastTick(game, player) {
        if (!player.credits || player.credits <= 0) {
            return
        }

        // On the last tick of the cycle:
        // 1. Spend remaining credits upgrading economy.
        let creditsToSpendEco = Math.floor(player.credits / 100 * LAST_TICK_BULK_UPGRADE_ECO_PERCENTAGE);

        if (creditsToSpendEco) {
            await this.starUpgradeService.upgradeBulk(game, player, 'totalCredits', 'economy', creditsToSpendEco, false);
        }
    }

};
