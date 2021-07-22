module.exports = class LeaderboardService {
    static SORTERS = {
        rank: {
            fullKey: 'achievements.rank',
            sort: {
                'achievements.rank': -1,
                'achievements.victories': -1,
                'achievements.renown': -1
            },
            select: {
                username: 1,
                guildId: 1,
                'roles.contributor': 1,
                'roles.developer': 1,
                'roles.communityManager': 1,
                'achievements.rank': 1,
                'achievements.victories': 1,
                'achievements.renown': 1
            }
        },
        victories: {
            fullKey: 'achievements.victories',
            sort: {
                'achievements.victories': -1,
                'achievements.rank': -1,
                'achievements.renown': -1
            },
            select: {
                username: 1,
                guildId: 1,
                'roles.contributor': 1,
                'roles.developer': 1,
                'roles.communityManager': 1,
                'achievements.victories': 1,
                'achievements.rank': 1,
                'achievements.renown': 1
            }
        },
        renown: {
            fullKey: 'achievements.renown',
            sort: {
                'achievements.renown': -1,
                'achievements.rank': -1,
                'achievements.victories': -1
            },
            select: {
                username: 1,
                guildId: 1,
                'roles.contributor': 1,
                'roles.developer': 1,
                'roles.communityManager': 1,
                'achievements.renown': 1,
                'achievements.rank': 1,
                'achievements.victories': 1
            }
        },
        joined: {
            fullKey: 'achievements.joined',
            sort: {
                'achievements.joined': -1
            },
            select: {
                username: 1,
                'achievements.joined': 1
            }
        },
        completed: {
            fullKey: 'achievements.completed',
            sort: {
                'achievements.completed': -1
            },
            select: {
                username: 1,
                'achievements.completed': 1
            }
        },
        quit: {
            fullKey: 'achievements.quit',
            sort: {
                'achievements.quit': -1
            },
            select: {
                username: 1,
                'achievements.quit': 1
            }
        },
        defeated: {
            fullKey: 'achievements.defeated',
            sort: {
                'achievements.defeated': -1
            },
            select: {
                username: 1,
                'achievements.defeated': 1
            }
        },
        afk: {
            fullKey: 'achievements.afk',
            sort: {
                'achievements.afk': -1
            },
            select: {
                username: 1,
                'achievements.afk': 1
            }
        },
        "ships-killed": {
            fullKey: 'achievements.combat.kills.ships',
            sort: {
                'achievements.combat.kills.ships': -1
            },
            select: {
                username: 1,
                'achievements.combat.kills.ships': 1
            }
        },
        "carriers-killed": {
            fullKey: 'achievements.combat.kills.carriers',
            sort: {
                'achievements.combat.kills.carriers': -1
            },
            select: {
                username: 1,
                'achievements.combat.kills.carriers': 1
            }
        },
        "specialists-killed": {
            fullKey: 'achievements.combat.kills.specialists',
            sort: {
                'achievements.combat.kills.specialists': -1
            },
            select: {
                username: 1,
                'achievements.combat.kills.specialists': 1
            }
        },
        "ships-lost": {
            fullKey: 'achievements.combat.losses.ships',
            sort: {
                'achievements.combat.losses.ships': -1
            },
            select: {
                username: 1,
                'achievements.combat.losses.ships': 1
            }
        },
        "carriers-lost": {
            fullKey: 'achievements.combat.losses.carriers',
            sort: {
                'achievements.combat.losses.carriers': -1
            },
            select: {
                username: 1,
                'achievements.combat.losses.carriers': 1
            }
        },
        "specialists-lost": {
            fullKey: 'achievements.combat.losses.specialists',
            sort: {
                'achievements.combat.losses.specialists': -1
            },
            select: {
                username: 1,
                'achievements.combat.losses.specialists': 1
            }
        },
        "stars-captured": {
            fullKey: 'achievements.combat.stars.captured',
            sort: {
                'achievements.combat.stars.captured': -1
            },
            select: {
                username: 1,
                'achievements.combat.stars.captured': 1
            }
        },
        "stars-lost": {
            fullKey: 'achievements.combat.stars.lost',
            sort: {
                'achievements.combat.stars.lost': -1
            },
            select: {
                username: 1,
                'achievements.combat.stars.lost': 1
            }
        },
        "economy": {
            fullKey: 'achievements.infastructure.economy',
            sort: {
                'achievements.infastructure.economy': -1
            },
            select: {
                username: 1,
                'achievements.infastructure.economy': 1
            }
        },
        "industry": {
            fullKey: 'achievements.infastructure.industry',
            sort: {
                'achievements.infastructure.industry': -1
            },
            select: {
                username: 1,
                'achievements.infastructure.industry': 1
            }
        },
        "science": {
            fullKey: 'achievements.infastructure.science',
            sort: {
                'achievements.infastructure.science': -1
            },
            select: {
                username: 1,
                'achievements.infastructure.science': 1
            }
        },
        "warpgates-built": {
            fullKey: 'achievements.infastructure.warpGates',
            sort: {
                'achievements.infastructure.warpGates': -1
            },
            select: {
                username: 1,
                'achievements.infastructure.warpGates': 1
            }
        },
        "warpgates-destroyed": {
            fullKey: 'achievements.infastructure.warpGatesDestroyed',
            sort: {
                'achievements.infastructure.warpGatesDestroyed': -1
            },
            select: {
                username: 1,
                'achievements.infastructure.warpGatesDestroyed': 1
            }
        },
        "carriers-built": {
            fullKey: 'achievements.infastructure.carriers',
            sort: {
                'achievements.infastructure.carriers': -1
            },
            select: {
                username: 1,
                'achievements.infastructure.carriers': 1
            }
        },
        "specialists-hired": {
            fullKey: 'achievements.infastructure.specialistsHired',
            sort: {
                'achievements.infastructure.specialistsHired': -1
            },
            select: {
                username: 1,
                'achievements.infastructure.specialistsHired': 1
            }
        },
        "scanning": {
            fullKey: 'achievements.research.scanning',
            sort: {
                'achievements.research.scanning': -1
            },
            select: {
                username: 1,
                'achievements.research.scanning': 1
            }
        },
        "hyperspace": {
            fullKey: 'achievements.research.hyperspace',
            sort: {
                'achievements.research.hyperspace': -1
            },
            select: {
                username: 1,
                'achievements.research.hyperspace': 1
            }
        },
        "terraforming": {
            fullKey: 'achievements.research.terraforming',
            sort: {
                'achievements.research.terraforming': -1
            },
            select: {
                username: 1,
                'achievements.research.terraforming': 1
            }
        },
        "experimentation": {
            fullKey: 'achievements.research.experimentation',
            sort: {
                'achievements.research.experimentation': -1
            },
            select: {
                username: 1,
                'achievements.research.experimentation': 1
            }
        },
        "weapons": {
            fullKey: 'achievements.research.weapons',
            sort: {
                'achievements.research.weapons': -1
            },
            select: {
                username: 1,
                'achievements.research.weapons': 1
            }
        },
        "banking": {
            fullKey: 'achievements.research.banking',
            sort: {
                'achievements.research.banking': -1
            },
            select: {
                username: 1,
                'achievements.research.banking': 1
            }
        },
        "manufacturing": {
            fullKey: 'achievements.research.manufacturing',
            sort: {
                'achievements.research.manufacturing': -1
            },
            select: {
                username: 1,
                'achievements.research.manufacturing': 1
            }
        },
        "specialists": {
            fullKey: 'achievements.research.specialists',
            sort: {
                'achievements.research.specialists': -1
            },
            select: {
                username: 1,
                'achievements.research.specialists': 1
            }
        },
        "credits-sent": {
            fullKey: 'achievements.trade.creditsSent',
            sort: {
                'achievements.trade.creditsSent': -1
            },
            select: {
                username: 1,
                'achievements.trade.creditsSent': 1
            }
        },
        "credits-received": {
            fullKey: 'achievements.trade.creditsReceived',
            sort: {
                'achievements.trade.creditsReceived': -1
            },
            select: {
                username: 1,
                'achievements.trade.creditsReceived': 1
            }
        },
        "technologies-sent": {
            fullKey: 'achievements.trade.technologySent',
            sort: {
                'achievements.trade.technologySent': -1
            },
            select: {
                username: 1,
                'achievements.trade.technologySent': 1
            }
        },
        "technologies-received": {
            fullKey: 'achievements.trade.technologyReceived',
            sort: {
                'achievements.trade.technologyReceived': -1
            },
            select: {
                username: 1,
                'achievements.trade.technologyReceived': 1
            }
        },
        "ships-gifted": {
            fullKey: 'achievements.trade.giftsSent',
            sort: {
                'achievements.trade.giftsSent': -1
            },
            select: {
                username: 1,
                'achievements.trade.giftsSent': 1
            }
        },
        "ships-received": {
            fullKey: 'achievements.trade.giftsReceived',
            sort: {
                'achievements.trade.giftsReceived': -1
            },
            select: {
                username: 1,
                'achievements.trade.giftsReceived': 1
            }
        },
        "renown-sent": {
            fullKey: 'achievements.trade.renownSent',
            sort: {
                'achievements.trade.renownSent': -1
            },
            select: {
                username: 1,
                'achievements.trade.renownSent': 1
            }
        }
    }

    constructor(userModel, userService, playerService, guildUserService) {
        this.userModel = userModel;
        this.userService = userService;
        this.playerService = playerService;
        this.guildUserService = guildUserService;
    }

    async getLeaderboard(limit, sortingKey) {
        const sorter = LeaderboardService.SORTERS[sortingKey] || LeaderboardService.SORTERS['rank']
        let leaderboard = await this.userModel.find({})
            .limit(limit)
            .sort(sorter.sort)
            .select(sorter.select)
            .lean({ defaults: true })
            .exec();

        let userIds = leaderboard.map(x => x._id);
        let guildUsers = await this.guildUserService.listUsersWithGuildTags(userIds);

        for (let i = 0; i < leaderboard.length; i++) {
            let user = leaderboard[i];

            user.position = i + 1;

            user.guild = guildUsers.find(x => x._id.equals(user._id)).guild;
        }

        let totalPlayers = await this.userModel.countDocuments();

        return {
            totalPlayers,
            leaderboard,
            sorter
        };
    }

    getLeaderboardRankings(game) {
        let playerStats = game.galaxy.players.map(p => {
            return {
                player: p,
                stats: this.playerService.getStats(game, p)
            }
        });

        function sortPlayers(a, b) {
            // Sort by total stars descending
            if (a.stats.totalStars > b.stats.totalStars) return -1;
            if (a.stats.totalStars < b.stats.totalStars) return 1;

            // Then by total ships descending
            if (a.stats.totalShips > b.stats.totalShips) return -1;
            if (a.stats.totalShips < b.stats.totalShips) return 1;

            // Then by total carriers descending
            if (a.stats.totalCarriers > b.stats.totalCarriers) return -1;
            if (a.stats.totalCarriers < b.stats.totalCarriers) return 1;

            // Then by defeated date descending
            if (a.defeated && b.defeated) {
                if (moment(a.defeatedDate) > moment(b.defeatedDate)) return -1;
                if (moment(a.defeatedDate) < moment(b.defeatedDate)) return 1;
            }

            // Sort defeated players last.
            return (a.defeated === b.defeated) ? 0 : a.defeated ? 1 : -1;
        }

        // Sort the undefeated players first.
        let undefeatedLeaderboard = playerStats
            .filter(x => !x.player.defeated)
            .sort(sortPlayers);

        // Sort the defeated players next.
        let defeatedLeaderboard = playerStats
            .filter(x => x.player.defeated)
            .sort(sortPlayers);

        // Join both sorted arrays together to produce the leaderboard.
        let leaderboard = undefeatedLeaderboard.concat(defeatedLeaderboard);

        return leaderboard;
    }

    async addGameRankings(game, gameUsers, leaderboard) {
        let leaderboardPlayers = leaderboard.map(x => x.player);

        // Remove any afk players from the leaderboard, they will not
        // receive any achievements.
        leaderboardPlayers = leaderboardPlayers.filter(p => !p.afk);

        for (let i = 0; i < leaderboardPlayers.length; i++) {
            let player = leaderboardPlayers[i];

            let user = gameUsers.find(u => u._id.equals(player.userId));

            // Double check user isn't deleted.
            if (!user) {
                continue;
            }

            // Add to rank:
            // (Number of players / 2) - index of leaderboard
            // But 1st place will receive rank equal to the total number of players.
            // So 1st place of 4 players will receive 4 rank
            // 2nd place will receive 1 rank (4 / 2 - 1)
            // 3rd place will receive 0 rank (4 / 2 - 2)
            // 4th place will receive -1 rank (4 / 2 - 3)

            // TODO: Maybe a better ranking system would be to simply award players
            // rank equal to the number of stars they have at the end of the game?
        
            // Official games are either not user created or featured (featured games can be user created)
            let isOfficialGame = game.settings.general.type != 'custom' || game.settings.general.featured;

            if (isOfficialGame) {
                if (i == 0) {
                    user.achievements.victories++; // Increase the winner's victory count
                    user.credits++; // Give the winner a galactic credit.
                    user.achievements.rank += leaderboard.length; // Note: Using leaderboard length as this includes ALL players (including afk)
                }
                else if (game.settings.general.awardRankTo === 'all') {
                    user.achievements.rank += leaderboard.length / 2 - i;
                    user.achievements.rank = Math.max(user.achievements.rank, 0); // Cannot go less than 0.
                }

                user.achievements.rank = Math.round(user.achievements.rank);    
            }

            // If the player hasn't been defeated then add completed stats.
            if (!player.defeated) {
                user.achievements.completed++;
            }
        }
    }

    getGameWinner(game) {
        if (game.settings.general.mode === 'conquest') {
            let starWinner = this.getStarCountWinner(game);
    
            if (starWinner) {
                return starWinner;
            }
        }

        let lastManStanding = this.getLastManStanding(game);

        if (lastManStanding) {
            return lastManStanding;
        }

        return null;
    }

    getStarCountWinner(game) {
        // There could be more than one player who has reached
        // the number of stars required at the same time.
        // In this case we pick the player who has the most ships.
        // If that's equal, then pick the player who has the most carriers.
        let leaderboard = this.getLeaderboardRankings(game);

        let starWinners = leaderboard
            .filter(p => !p.player.defeated && p.stats.totalStars >= game.state.starsForVictory)
            .map(p => p.player);

        if (starWinners.length) {
            return starWinners[0];
        }

        return null;
    }

    getLastManStanding(game) {
        let undefeatedPlayers = game.galaxy.players.filter(p => !p.defeated);

        if (undefeatedPlayers.length === 1) {
            return undefeatedPlayers[0];
        }

        // If all players have been defeated somehow then pick the player
        // who is currently in first place.
        let defeatedPlayers = game.galaxy.players.filter(p => p.defeated);

        if (defeatedPlayers.length === game.settings.general.playerLimit) {
            let leaderboard = this.getLeaderboardRankings(game);

            return leaderboard[0].player;
        }

        return null;
    }

};
