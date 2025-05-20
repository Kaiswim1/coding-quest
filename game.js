const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 500 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  const game = new Phaser.Game(config);
  let player, cursors, platforms;
  
  function preload() {
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/sky4.png');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
  }
  
  function create() {
    this.add.image(0, 0, 'sky').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height);
  
    platforms = this.physics.add.staticGroup();
    platforms.create(this.scale.width / 2, this.scale.height - 32, 'ground').setScale(2).refreshBody();
  
    player = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 150, 'player');
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);
  
    this.physics.add.collider(player, platforms);
  
    cursors = this.input.keyboard.createCursorKeys();
  }
  
  function update() {
    const speed = 200;
    const delta = this.game.loop.delta / 1000;
    const moveAmount = speed * delta;
  
    let direction = 0;
    if (cursors.left.isDown) {
      direction = 1; // move platforms right
    } else if (cursors.right.isDown) {
      direction = -1; // move platforms left
    }
  
    if (direction !== 0) {
      // Move platforms
      platforms.children.iterate(platform => {
        platform.x += moveAmount * direction;
      });
      platforms.refresh();
  
      // If overlapping, nudge back until clear
      while (platforms.children.entries.some(p => this.physics.world.overlap(player, p))) {
        platforms.children.iterate(platform => {
          platform.x -= 1 * direction; // nudge back slowly
        });
        platforms.refresh();
      }
    }
  
    if (cursors.up.isDown && player.body.blocked.down) {
      player.setVelocityY(-350);
    }
  }

  document.getElementById('closeGame').addEventListener('click', function() {
    console.log('hello'); 
    game.destroy(true); // `true` removes the canvas element from the DOM
    document.getElementById('gameIframe').style.display = 'none'; // Hides container
    window.location.href = "https://www.google.com";

  });
