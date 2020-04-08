import * as PIXI from 'pixi.js'
import Carrier from './carrier'
import EventEmitter from 'events'

class Star extends EventEmitter {
  constructor () {
    super()

    this.container = new PIXI.Container()
    this.container.interactive = true
    this.container.buttonMode = true

    this.container.on('pointerdown', this.onClicked.bind(this))
    this.container.on('mouseover', this.onMouseOver.bind(this))
    this.container.on('mouseout', this.onMouseOut.bind(this))

    this.isSelected = false
    this.isMouseOver = false
  }

  _getStarPlayer () {
    return this.players.find(x => x._id === this.data.ownedByPlayerId)
  }

  _getStarCarriers () {
    let carriersAtStar = this.carriers.filter(x => x.orbiting === this.data._id)

    return carriersAtStar
  }

  _getStarCarrierGarrison () {
    return this._getStarCarriers().reduce((sum, c) => sum + c.ships, 0)
  }

  _isOutOfScanningRange () {
    // These may be undefined, if so it means that they are out of scanning range.
    return typeof this.data.economy === 'undefined' ||
            typeof this.data.industry === 'undefined' ||
            typeof this.data.science === 'undefined'
  }

  setup (data, players, carriers) {
    this.data = data
    this.players = players
    this.carriers = carriers
  }

  draw () {
    this.container.removeChildren()

    this.drawColour()

    // If the star has a carrier, draw that instead of the star circle.
    if (this._getStarCarriers().length) { this.drawCarrier() } else { this.drawStar() }

    if (this.isMouseOver) {
      this.drawHalo()
    }

    if (this.isSelected) {
      this.drawInfrastructure()
      this.drawScanningRange()
      this.drawHyperspaceRange()
    }

    if (this.isMouseOver || this.isSelected) {
      this.drawName()
      this.drawGarrison()
      this.drawPlayerName()
    }
  }

  drawStar () {
    let graphics = new PIXI.Graphics()

    if (this._isOutOfScanningRange()) {
      graphics.lineStyle(1, 0xFFFFFF)
      graphics.beginFill(0x000000)
    } else {
      graphics.lineStyle(0)
      graphics.beginFill(0xFFFFFF)
    }

    // If its a warp gate then draw a filled square.
    // Otherwise draw a filled circle.
    if (this.data.warpGate) {
      graphics.drawRect(this.data.location.x - 2, this.data.location.y - 2, 4, 4)
    } else {
      graphics.drawCircle(this.data.location.x, this.data.location.y, 2)
    }

    graphics.endFill()

    this.container.addChild(graphics)
  }

  drawColour () {
    // Get the player who owns the star.
    let player = this._getStarPlayer()

    if (!player) { return }

    let graphics = new PIXI.Graphics()

    graphics.lineStyle(2, player.colour.value)

    // If its a warp gate then draw a rectangle.
    // Otherwise draw a circle.
    if (this.data.warpGate) {
      graphics.drawRect(this.data.location.x - 4, this.data.location.y - 4, 8, 8)
    } else {
      graphics.drawCircle(this.data.location.x, this.data.location.y, 4)
    }

    this.container.addChild(graphics)
  }

  drawCarrier () {
    let starCarriers = this._getStarCarriers()

    if (!starCarriers.length) { return }

    let carrier = new Carrier()
    carrier.setup(starCarriers[0])

    carrier.draw()

    this.container.addChild(carrier.container)

    carrier.on('onCarrierClicked', this.onCarrierClicked.bind(this))
  }

  drawHalo () {
    let graphics = new PIXI.Graphics()

    graphics.lineStyle(1, 0xFFFFFF, 0.1)
    graphics.drawCircle(this.data.location.x, this.data.location.y, this.data.naturalResources / 2)

    this.container.addChild(graphics)
  }

  drawName () {
    let text = new PIXI.Text(this.data.name, {
      fontSize: 4,
      fill: 0xFFFFFF
    })

    text.x = this.data.location.x - (text.width / 2)
    text.y = this.data.location.y + 7
    text.resolution = 10

    this.container.addChild(text)
  }

  drawGarrison () {
    let totalGarrison = (this.data.garrison || 0) + this._getStarCarrierGarrison()

    if (!totalGarrison) return

    let text = new PIXI.Text(totalGarrison, {
      fontSize: 4,
      fill: 0xFFFFFF
    })

    text.x = this.data.location.x - (text.width / 2)
    text.y = this.data.location.y + 12
    text.resolution = 10

    this.container.addChild(text)
  }

  drawInfrastructure () {
    if (!this.data.ownedByPlayerId) return // TODO Does abandoning stars destroy ALL infrastructure?
    if (this._isOutOfScanningRange()) return

    let text = new PIXI.Text(`${this.data.economy} ${this.data.industry} ${this.data.science}`, {
      fontSize: 4,
      fill: 0xFFFFFF
    })

    text.x = this.data.location.x - (text.width / 2)
    text.y = this.data.location.y - 12
    text.resolution = 10

    this.container.addChild(text)
  }

  drawPlayerName () {
    // Get the player who owns the star.
    let player = this._getStarPlayer()

    if (!player) { return }

    let text = new PIXI.Text(player.alias, {
      fontSize: 4,
      fill: 0xFFFFFF
    })

    text.x = this.data.location.x - (text.width / 2)
    text.y = this.data.location.y + 17
    text.resolution = 10

    this.container.addChild(text)
  }

  drawScanningRange () {
    // Get the player who owns the star.
    let player = this._getStarPlayer()

    if (!player) { return }

    let graphics = new PIXI.Graphics()

    let radius = (((player.research.scanning.level || 1) + 2) * 30) / 2

    graphics.lineStyle(1, 0xFFFFFF, 0.3)
    graphics.drawStar(this.data.location.x, this.data.location.y, radius, radius, radius - 1)

    this.container.addChild(graphics)
  }

  drawHyperspaceRange () {
    // Get the player who owns the star.
    let player = this._getStarPlayer()

    if (!player) { return }

    let graphics = new PIXI.Graphics()

    let radius = (((player.research.hyperspace.level || 1) + 3) * 30) / 2

    graphics.lineStyle(1, 0xFFFFFF, 0.3)
    graphics.drawStar(this.data.location.x, this.data.location.y, radius, radius, radius - 2)

    this.container.addChild(graphics)
  }

  onClicked (e) {
    this.isSelected = true //!this.isSelected

    this.emit('onStarClicked', this)
  }

  onCarrierClicked (e) {
    this.selected = false

    this.emit('onCarrierClicked', e)
  }

  onMouseOver (e) {
    this.isMouseOver = true

    this.draw()

    this.emit('onStarMouseOver', this)
  }

  onMouseOut (e) {
    this.isMouseOver = false

    this.draw()

    this.emit('onStarMouseOut', this)
  }
}

export default Star
