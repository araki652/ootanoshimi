// メインゲームスクリプト
// 全ての分割ファイルを統合して実行

window.onload = function() {
    // === グローバル変数初期化 ===
    let currentJob = null;
    let gameManager = new GameManager();
    let uiUpdater = new UIUpdater();
    let shopSystem = new ShopSystem();

    const player = new Player();
    let statusManager = new StatusManager(player);

    // --- DOM要素 ---
    const introScreen = document.getElementById("intro-screen");
    const jobSelectScreen = document.getElementById("job-select-screen");
    const mainGameInterface = document.getElementById("main-game-interface");

    const actionArea = document.getElementById("action-area");
    const resultArea = document.getElementById("result-area");
    const atkBtn = document.getElementById("atk-btn");
    const fireBtn = document.getElementById("fire-btn");
    const healBtn = document.getElementById("heal-btn");
    const nextBtn = document.getElementById("next-btn");
    const gameStartBtn = document.getElementById("game-start-btn");

    const shopOpenBtn = document.getElementById("shop-open-btn");
    const shopCloseBtn = document.getElementById("shop-close-btn");
    const shopModal = document.getElementById("shop-modal");
    const shopItemsContainer = document.getElementById("shop-items");
    const shopGoldLabel = document.getElementById("shop-gold");
    const shopMpRestoreBtn = document.getElementById("shop-mp-restore-btn");

    // --- ゲーム開始 ---
    gameStartBtn.addEventListener("click", () => {
        introScreen.style.display = "none";
        jobSelectScreen.style.display = "block";
    });

    // 職業選択（5職業対応）
    document.getElementById("job-warrior").addEventListener("click", () => selectJob("warrior"));
    document.getElementById("job-mage").addEventListener("click", () => selectJob("mage"));
    document.getElementById("job-paladin").addEventListener("click", () => selectJob("paladin"));
    document.getElementById("job-assassin").addEventListener("click", () => selectJob("assassin"));
    document.getElementById("job-bishop").addEventListener("click", () => selectJob("bishop"));

    function selectJob(jobKey) {
        currentJob = jobs[jobKey];
        player.setJob(jobKey, currentJob);
        statusManager.recalculateStats();
        
        jobSelectScreen.style.display = "none";
        mainGameInterface.style.display = "block";
        gameManager.startGame();
        encountEnemy();
    }

    // --- 敵出現 ---
    function encountEnemy() {
        const stage = gameManager.getCurrentStage();
        uiUpdater.updateStageName(stage.name);

        gameManager.resetMonsterState();

        // ボス戦か判定
        if (gameManager.shouldFightBoss()) {
            if (gameManager.checkBossSpawn()) {
                // ボス戦
                gameManager.currentMonster = new Enemy(stage.boss);
                gameManager.monsterParty = [];
                gameManager.isMultiMonsterBattle = false;
                uiUpdater.setLog(`⚠ ${stage.boss.name} (BOSS) があらわれた！`);
                uiUpdater.applyBossName();
                uiUpdater.setSkillButtons(atkBtn, fireBtn, healBtn, currentJob);
            } else {
                // 通常敵
                encountNormalEnemy(stage);
            }
        }
        // 謎解きモード判定
        else if (gameManager.checkPuzzleMode()) {
            startPuzzle();
            return;
        }
        // 通常敵出現
        else if (gameManager.shouldEncounterNewEnemy()) {
            encountNormalEnemy(stage);
        }

        uiUpdater.updateAll(player, statusManager, gameManager.currentMonster, gameManager);
    }

    function encountNormalEnemy(stage) {
        const selectedEnemy = Enemy.selectRandom(stage.enemies);
        gameManager.currentMonster = selectedEnemy;

        // 複数体出現イベント
        if (gameManager.checkMultiEnemyEvent()) {
            gameManager.isMultiMonsterBattle = true;
            gameManager.monsterParty = gameManager.generateEnemyParty(selectedEnemy, stage);
            uiUpdater.setLog(`${selectedEnemy.name} と仲間たちがあらわれた！`);
        } else {
            gameManager.isMultiMonsterBattle = false;
            gameManager.monsterParty = [];
            uiUpdater.setLog(`${selectedEnemy.name} があらわれた！`);
        }

        uiUpdater.clearNameClass();
        if (selectedEnemy.type === 'rare') uiUpdater.applyRareName();
        uiUpdater.setSkillButtons(atkBtn, fireBtn, healBtn, currentJob);
    }

    // --- 謎解き処理 ---
    function startPuzzle() {
        gameManager.isPuzzleMode = true;
        const rIndex = Math.floor(Math.random() * riddles.length);
        gameManager.currentRiddle = riddles[rIndex];

        const message = `【門番の試練】\n門番が立ちはだかった！\n「通リタケレバ、答エヨ…」\n\n問: ${gameManager.currentRiddle.q}`;
        uiUpdater.setLog(message);
        
        uiUpdater.applyRareName();
        uiUpdater.setPuzzleButtons(atkBtn, fireBtn, healBtn, gameManager.currentRiddle);
        uiUpdater.updateAll(player, statusManager, null, gameManager);
    }

    function answerPuzzle(choiceIndex) {
        if (choiceIndex === gameManager.currentRiddle.ans) {
            uiUpdater.setLog("「正解ダ…」\n門番は光となって消えた。");
            player.hp = player.maxHp;
            player.mp = player.maxMp;
            player.clearAllAilments();
            
            player.exp += 50;
            if (statusManager.canLevelUp()) {
                player.levelUp(player.job);
                uiUpdater.addLog(`【祝】レベルアップ！ Lv${player.level} になった！`);
            }
            gameManager.stageKillCount++;
            
            actionArea.style.display = "none";
            resultArea.style.display = "flex";
            nextBtn.textContent = "奥へ進む";
        } else {
            const dmg = Math.floor(player.maxHp * 0.4);
            player.takeDamage(dmg);
            
            uiUpdater.setLog(`「愚カ者メ…！！」\n雷が落ちた！ ${dmg} のダメージ！`);
            gameManager.stageKillCount++;
            
            if (!checkResult()) {
                actionArea.style.display = "none";
                resultArea.style.display = "flex";
                nextBtn.textContent = "痛みを堪えて進む";
            }
        }
        statusManager.recalculateStats();
        uiUpdater.updatePlayerStatus(player, statusManager);
    }

    // --- バトル結果判定 ---
    function checkResult() {
        if (!gameManager.isPuzzleMode && gameManager.currentMonster.isDead()) {
            // 敵撃破
            const result = gameManager.defeatedMonster(gameManager.currentMonster, player);
            
            let msg = `★ ${gameManager.currentMonster.name}を倒した！\n`;
            msg += `Exp ${result.expGain}, Gold ${result.goldGain} を獲得！`;
            
            if (result.bonus > 1.0) {
                msg += `\n【連勝ボーナス ${Math.floor(result.bonus * 100)}%】`;
            }

            // レアドロップ処理
            if (result.dropItem) {
                const dropItem = shopItems.find(item => item.id === result.dropItem);
                if (dropItem && !dropItem.bought) {
                    dropItem.bought = true;
                    msg += `\n【レアドロップ】${dropItem.name}を手に入れた！`;
                    statusManager.recalculateStats();
                }
            }

            // レベルアップ判定
            if (statusManager.canLevelUp()) {
                player.levelUp(player.job);
                msg += `\n【祝】レベルアップ！ Lv${player.level} になった！`;
            }

            // 複数体戦闘処理
            if (gameManager.isMultiMonsterBattle && gameManager.monsterParty.length > 0) {
                const defeatedIdx = gameManager.monsterParty.findIndex(e => e.isDead());
                if (defeatedIdx !== -1) {
                    const result = gameManager.defeatedEnemyInParty(defeatedIdx);
                    msg += `\n仲間が1体倒れた！（残り${gameManager.monsterParty.length}体）`;
                    
                    if (!result.hasNext) {
                        msg += `\n全ての敵を倒した！`;
                    } else {
                        gameManager.currentMonster = result.nextEnemy;
                        uiUpdater.updateEnemyStatus(gameManager.currentMonster, false, gameManager.isMultiMonsterBattle, gameManager.monsterParty);
                    }
                }
            }

            // ボス戦判定
            if (gameManager.currentMonster.isBoss) {
                if (gameManager.isFinalBoss()) {
                    msg += `\n全ての戦いが終わった…。\n魔王は崩れ去り、光が世界を包む。\n(THE END)`;
                    gameManager.currentStageIndex = 0;
                    player.consecutiveWins = 0;
                } else {
                    msg += `\n=== ステージクリア！ ===\n次のエリアへ進みます。`;
                    gameManager.clearStage();
                    player.consecutiveWins++;
                }
            } else {
                // 複数体がすべて倒されたか確認
                if (!gameManager.isMultiMonsterBattle || gameManager.monsterParty.length === 0) {
                    gameManager.stageKillCount++;
                    player.consecutiveWins++;
                }
            }

            uiUpdater.setLog(msg);
            statusManager.recalculateStats();
            uiUpdater.updateAll(player, statusManager, gameManager.currentMonster, gameManager);
            
            // 複数体がすべて倒されたか確認
            if (gameManager.currentMonster.isDead() && (!gameManager.isMultiMonsterBattle || gameManager.monsterParty.length === 0)) {
                actionArea.style.display = "none";
                resultArea.style.display = "flex";
                nextBtn.textContent = "次の戦いへ";
            }
            
            return true;
        }
        
        if (player.isDead()) {
            // 敗北処理
            const result = gameManager.handleGameOver(player);
            statusManager.recalculateStats();
            uiUpdater.updateAll(player, statusManager, null, gameManager);
            
            actionArea.style.display = "none";
            resultArea.style.display = "flex";
            nextBtn.textContent = "再起する";
            
            const message = result.isFullLost 
                ? `● 敗北… (BAD END)\n${result.message}`
                : `● 敗北…\n${result.message}`;
            
            uiUpdater.setLog(message);
            return true;
        }
        return false;
    }

    // --- スキル実行 ---
    function executeSkill(skillIndex) {
        const skill = currentJob.skills[skillIndex];
        
        if (player.mp < skill.mp) {
            uiUpdater.setLog("MPが足りない！");
            uiUpdater.flashMpBar();
            return;
        }
        
        player.mp -= skill.mp;

        const skillResult = BattleSystem.executeSkill(skill, player, gameManager.currentMonster, player.job);
        gameManager.currentMonster.takeDamage(skillResult.damage);

        // 複数体戦闘時は敵パーティにもダメージを適用
        if (gameManager.isMultiMonsterBattle && gameManager.monsterParty.length > 0) {
            gameManager.monsterParty.forEach(e => {
                if (e.hp > 0) e.takeDamage(Math.floor(skillResult.damage * 0.5));
            });
        }

        // 状態異常付与
        if (skillResult.effect) {
            if (skillResult.effect === 'paralysis') {
                player.applyAilment('paralysis');
            }
        }

        uiUpdater.setLog(skillResult.message);
        statusManager.recalculateStats();
        uiUpdater.updateAll(player, statusManager, gameManager.currentMonster, gameManager);
        
        if (!checkResult()) changeTurnToEnemy();
    }

    // --- 敵ターン処理 ---
    function changeTurnToEnemy() {
        disableButtons();
        setTimeout(() => {
            if (gameManager.currentMonster.hp > 0 && !gameManager.isPuzzleMode) {
                // 睡眠状態判定
                if (player.hasAilment('sleep')) {
                    uiUpdater.addLog(`\n${gameManager.currentMonster.name}は眠っている…`);
                    player.cureAilment('sleep');
                    checkResult();
                    if (!player.isDead()) enableButtons();
                    return;
                }

                // 混乱状態判定
                if (player.hasAilment('confusion')) {
                    if (Math.random() < 0.5) {
                        const confDmg = Math.floor(player.atk * 0.3);
                        player.takeDamage(confDmg);
                        uiUpdater.addLog(`\n混乱している！ 自分に ${confDmg} のダメージ！`);
                        if (Math.random() < 0.3) player.cureAilment('confusion');
                        checkResult();
                        if (!player.isDead()) enableButtons();
                        return;
                    }
                }

                // 敵通常攻撃
                const attackResult = BattleSystem.executeEnemyAttack(gameManager.currentMonster, player);
                player.takeDamage(attackResult.damage);
                uiUpdater.updatePlayerStatus(player, statusManager);
                uiUpdater.addLog(`\n${attackResult.message}`);

                // 毒ダメージ
                const poisonResult = BattleSystem.processPoisonDamage(player);
                if (poisonResult) {
                    uiUpdater.updatePlayerStatus(player, statusManager);
                    uiUpdater.addLog(`\n${poisonResult.message}`);
                }

                // 複数体戦闘時の追加攻撃
                if (gameManager.isMultiMonsterBattle && gameManager.monsterParty.length > 0) {
                    const attackingEnemyIdx = Math.floor(Math.random() * gameManager.monsterParty.length);
                    const attackingEnemy = gameManager.monsterParty[attackingEnemyIdx];
                    
                    const addAttackDmg = attackingEnemy.atk;
                    const addRes = BattleSystem.calculateDamage(addAttackDmg, player.def, 'phys');
                    
                    if (!addRes.isMiss) {
                        player.takeDamage(addRes.val);
                        uiUpdater.updatePlayerStatus(player, statusManager);
                        let addMsg = `\n${attackingEnemy.name}も攻撃！ ${addRes.val} のダメージ！`;
                        if (addRes.isCrit) addMsg = "\n★" + addMsg;
                        uiUpdater.addLog(addMsg);
                    }
                }

                checkResult();
            }
            if (!player.isDead() && (gameManager.currentMonster.hp > 0 || gameManager.isPuzzleMode)) enableButtons();
        }, 600);
    }

    function disableButtons() {
        atkBtn.disabled = true;
        fireBtn.disabled = true;
        healBtn.disabled = true;
    }

    function enableButtons() {
        atkBtn.disabled = false;
        fireBtn.disabled = false;
        healBtn.disabled = false;
    }

    // --- ボタンイベント ---
    atkBtn.addEventListener("click", () => {
        if (gameManager.isPuzzleMode) answerPuzzle(0);
        else executeSkill(0);
    });

    fireBtn.addEventListener("click", () => {
        if (gameManager.isPuzzleMode) answerPuzzle(1);
        else executeSkill(1);
    });

    healBtn.addEventListener("click", () => {
        if (gameManager.isPuzzleMode) answerPuzzle(2);
        else executeSkill(2);
    });

    nextBtn.addEventListener("click", () => {
        resultArea.style.display = "none";
        actionArea.style.display = "flex";
        encountEnemy();
        enableButtons();
    });

    // --- ショップシステム ---
    function renderShop() {
        shopItemsContainer.innerHTML = "";
        shopGoldLabel.textContent = player.gold;
        document.getElementById("job-name-shop").textContent = currentJob.name;

        shopItems.forEach(item => {
            if (item.jobs && !item.jobs.includes(player.job)) return;
            
            const row = document.createElement("div");
            row.className = "shop-item";
            
            let desc = `${item.name} `;
            if (item.type === 'atk') desc += `(攻+${item.val})`;
            if (item.type === 'def') desc += `(防+${item.val})`;
            if (item.type === 'matk') desc += `(魔+${item.val})`;
            if (item.type === 'heal') desc += `(HP全回復)`;
            if (item.type === 'mpRestore') desc += `(MP${item.val})`;
            if (item.type === 'mpUp') desc += `(MP+${item.val})`;
            if (item.type === 'mpRecover') desc += `(攻撃時MP回復)`;
            if (item.type === 'ailment') desc += `(状態異常解除)`;
            
            const info = document.createElement("span");
            info.textContent = desc;
            if (item.bought && !item.repeatable) info.classList.add("bought");

            const buyBtn = document.createElement("button");
            
            if (item.bought && !item.repeatable) {
                buyBtn.textContent = "済";
                buyBtn.disabled = true;
            } else {
                buyBtn.textContent = `${item.cost}G`;
                buyBtn.onclick = () => {
                    const result = shopSystem.buyItem(item.id, player);
                    if (result.success) {
                        statusManager.recalculateStats();
                        uiUpdater.updatePlayerStatus(player, statusManager);
                        renderShop();
                    }
                };
                if (player.gold < item.cost) buyBtn.disabled = true;
            }

            row.appendChild(info);
            row.appendChild(buyBtn);
            shopItemsContainer.appendChild(row);
        });
    }

    shopOpenBtn.addEventListener("click", () => {
        renderShop();
        shopModal.style.display = "flex";
    });

    shopCloseBtn.addEventListener("click", () => {
        shopModal.style.display = "none";
    });

    shopMpRestoreBtn.addEventListener("click", () => {
        const result = shopSystem.buyMpRestorePotion(player);
        if (result.success) {
            uiUpdater.updatePlayerStatus(player, statusManager);
            renderShop();
        }
    });
};
