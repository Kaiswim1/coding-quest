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
  let bg1, bg2;
  
  function preload() {
    this.load.image('sky', 'forest.jpg'); // background
    this.load.image('ground1', 'costume1 (4).png');
    this.load.image('ground2', 'costume2 (3).png');
    this.load.image('ground3', 'costume3.png');
    this.load.image('ground6', 'costume6.png');
    this.load.image('ground4', 'costume4.png');
    this.load.image('ground5', 'costume5.png'); 
    this.load.image('sign', 'sign-removebg-preview.png');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
  }
  
  function create() {
    const width = this.scale.width;
    const height = this.scale.height;
  
    // Background stitched: two images side-by-side, one flipped
    bg1 = this.add.image(0, 0, 'sky').setOrigin(0).setDisplaySize(width, height);
    bg2 = this.add.image(width, 0, 'sky').setOrigin(0).setDisplaySize(width, height).setFlipX(true); 
    this.add.image(200, 500,'sign').setDisplaySize(400,350)
  
    platforms = this.physics.add.staticGroup();
  
    function createPlatform(x, y, xScale = 1, yScale = 1, key = 'ground1') {
      const platform = platforms.create(x, y, key);
      platform.setScale(xScale, yScale);
      platform.refreshBody();
    }
  
    createPlatform(width / 2, height - 32, 2, 1, 'ground1'); // Ground
    createPlatform(900, 600, 1, 0.5, 'ground2');
    createPlatform(800, 560, 0.3, 0.2, 'ground3'); 
    createPlatform(870, 530, 0.3, 0.2, 'ground4');
    createPlatform(900, 500, 0.1, 0.07, 'ground5');  
    createPlatform(880, 480, 0.1, 0.07, 'ground5'); 
   
  
    player = this.physics.add.sprite(width / 2, height - 150, 'player').setScale(2, 2);
    player.setBounce(0.1);
    player.body.setCollideWorldBounds(true);
    player.body.checkCollision.up = false;
    player.body.checkCollision.left = false;
    player.body.checkCollision.right = false;
    this.physics.add.collider(player, platforms);
  
    cursors = this.input.keyboard.createCursorKeys();
  }
  
  function update() {
    const speed = 200;
    const height = this.scale.height;
  
    // Horizontal movement
    if (cursors.left.isDown) {
      player.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
      player.setVelocityX(speed);
    } else {
      player.setVelocityX(0);
    }
  
    // Adjust player scale based on Y position
    const minScale = 0.005; // Smallest at top
    const maxScale = 2;   // Largest at bottom
  
    const t = Phaser.Math.Clamp(player.y / height, 0, 1);
    const scale = Phaser.Math.Linear(minScale, maxScale, t);
    player.setScale(scale);
  
    // Jump strength also decreases as player goes higher
    const jumpStrength = Phaser.Math.Linear(-200, -350, t);
    if (cursors.up.isDown && player.body.blocked.down) {
      player.setVelocityY(jumpStrength);
    }
  }
  
