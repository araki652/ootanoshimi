// ゲーム全体管理システム
class GameManager {
    constructor() {
        this.currentStageIndex = 0;
        this.stageKillCount = 0;
        this.currentMonster = null;
        this.monsterParty = [];
        this.isMultiMonsterBattle = false;
        this.isPuzzleMode = false;
        this.currentRiddle = null;
        this.isGameRunning = false;
    }

    // ゲーム開始
    startGame() {
        this.isGameRunning = true;
        this.currentStageIndex = 0;
        this.stageKillCount = 0;
        this.resetMonsterState();
    }

    // ゲーム終了
    endGame() {
        this.isGameRunning = false;
    }

    // 敵状態をリセット
    resetMonsterState() {
        this.currentMonster = null;
        this.monsterParty = [];
        this.isMultiMonsterBattle = false;
        this.isPuzzleMode = false;
        this.currentRiddle = null;
    }

    // ステージクリア処理
    clearStage() {
        this.stageKillCount = 0;
        // ステージインデックスは呼び出し元で管理するので、ここでは進めない
        // this.currentStageIndex++;
        // if (this.currentStageIndex >= stages.length) {
        //     this.currentStageIndex = 0;
        // }
        this.resetMonsterState();
    }

    // ステージ敗退処理
    retreatFromStage() {
        this.currentStageIndex = 0;
        this.stageKillCount = 0;
        this.resetMonsterState();
    }

    // 現在のステージを取得
    getCurrentStage() {
        return stages[this.currentStageIndex];
    }

    // 複数体出現イベント判定
    checkMultiEnemyEvent() {
        const multiEnemyRate = 5; // 5%の確率
        return Math.random() < multiEnemyRate / 100;
    }

    // 敵パーティを生成
    generateEnemyParty(baseEnemy, stage, difficulty = 'normal', loopCount = 0) {
        const additionalCount = Math.floor(Math.random() * 3) + 1; // 1～3体追加
        const party = [];
        
        for (let i = 0; i < additionalCount; i++) {
            const selectedEnemy = Enemy.selectRandom(stage.enemies);
            party.push(new Enemy(selectedEnemy, difficulty, loopCount));
        }
        
        return party;
    }

    // 敵を倒した時の処理
    defeatedMonster(monster, player) {
        let expGain = monster.exp;
        let goldGain = monster.gold;

        // 連勝ボーナス計算
        const bonus = BattleSystem.getConsecutiveWinBonus(player.consecutiveWins);
        expGain = Math.floor(expGain * bonus);
        goldGain = Math.floor(goldGain * bonus);

        player.exp += expGain;
        player.gold += goldGain;

        // ボスドロップ処理
        let bossDropItems = [];
        if (monster.isBoss && monster.dropItems && monster.dropItems.length > 0) {
            // 難易度ごとのドロップ率
            const dropRates = {
                'easy': 0.2,
                'normal': 0.6,
                'hard': 1.0,
                'lunatic': 1.5,
                'inferno': 2.0
            };
            const baseRate = dropRates[player.difficulty] || 1.0;

            // 各ドロップアイテムを処理
            monster.dropItems.forEach(itemId => {
                // ドロップ率に基づいて確率判定
                let dropChance = baseRate;
                if (dropChance >= 1.0) {
                    // 1.0以上の場合：確定ドロップ + 追加ドロップの確率
                    bossDropItems.push(itemId);
                    player.bossDropItems.push(itemId);
                    // 追加ドロップ判定（例：lunatic 1.5倍 → 50%で追加）
                    if (Math.random() < (dropChance - 1.0)) {
                        bossDropItems.push(itemId);
                        player.bossDropItems.push(itemId);
                    }
                } else {
                    // 1.0未満の場合：確率に基づいてドロップ
                    if (Math.random() < dropChance) {
                        bossDropItems.push(itemId);
                        player.bossDropItems.push(itemId);
                    }
                }
            });
        }

        return {
            expGain,
            goldGain,
            bonus,
            dropItem: monster.getDropItem(),
            bossDropItems: bossDropItems
        };
    }

    // 複数体戦闘時の敵撃破処理
    defeatedEnemyInParty(defeatedIndex) {
        if (defeatedIndex !== -1 && defeatedIndex < this.monsterParty.length) {
            this.monsterParty.splice(defeatedIndex, 1);
        }

        // 次の敵に交代
        if (this.monsterParty.length > 0) {
            this.currentMonster = this.monsterParty[0];
            return { hasNext: true, nextEnemy: this.currentMonster };
        } else {
            this.isMultiMonsterBattle = false;
            return { hasNext: false };
        }
    }

    // ボスかどうか判定
    isBossBattle() {
        return this.currentMonster && this.currentMonster.isBoss;
    }

    // ラスボスかどうか判定
    isFinalBoss() {
        return this.currentMonster && this.currentMonster.name === "魔王";
    }

    // ゲームオーバー時の処理
    handleGameOver(player) {
        const BACK_TO_START_RATE = 0.5;
        const LOST_ALL_RATE = 0.3;

        let isFullLost = false;
        let isBackToStart = false;

        if (this.currentStageIndex > 0) {
            if (Math.random() < BACK_TO_START_RATE) {
                isBackToStart = true;
                this.retreatFromStage();
                
                if (Math.random() < LOST_ALL_RATE) {
                    isFullLost = true;
                }
            }
        }

        if (isFullLost) {
            player.reset();
            // すべての装備を未購入に戻す（shop.jsのshopItems配列を参照）
            shopItems.forEach(item => item.bought = false);
            return { isFullLost: true, message: "迷いの森まで吹き飛ばされ、全てを失った…。" };
        } else {
            player.gold = Math.floor(player.gold / 3);
            player.hp = player.maxHp;
            player.mp = player.maxMp;
            player.clearAllAilments();
            player.consecutiveWins = 0;
            this.stageKillCount = 0;

            if (isBackToStart) {
                return { isFullLost: false, message: "迷いの森まで戻ってしまった。" };
            } else {
                return { isFullLost: false, message: "(神の力で復活！)\n所持金が1/3になった。" };
            }
        }
    }

    // ステージボス戦利用判定
    shouldFightBoss() {
        const stage = this.getCurrentStage();
        return this.stageKillCount >= stage.reqKills;
    }

    // ボス出現判定
    checkBossSpawn() {
        const bossSpawnRate = 30;
        return Math.floor(Math.random() * 100) < bossSpawnRate;
    }

    // 謎解きモード開始判定
    checkPuzzleMode() {
        const stage = this.getCurrentStage();
        return stage.hasPuzzle && this.stageKillCount === stage.reqKills - 1;
    }

    // 次の敵を出現させるべきか判定
    shouldEncounterNewEnemy() {
        const stage = this.getCurrentStage();
        return this.stageKillCount < stage.reqKills;
    }
}
