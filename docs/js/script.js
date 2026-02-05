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
    const difficultySelectScreen = document.getElementById("difficulty-select-screen");
    const mainGameInterface = document.getElementById("main-game-interface");

    const actionArea = document.getElementById("action-area");
    const resultArea = document.getElementById("result-area");
    const atkBtn = document.getElementById("atk-btn");
    const fireBtn = document.getElementById("fire-btn");
    const healBtn = document.getElementById("heal-btn");
    const skilltreeBtn = document.getElementById("skilltree-btn");
    const nextBtn = document.getElementById("next-btn");
    const gameStartBtn = document.getElementById("game-start-btn");
    const continueBtn = document.getElementById("continue-btn");

    const shopOpenBtn = document.getElementById("shop-open-btn");
    const shopCloseBtn = document.getElementById("shop-close-btn");
    const shopModal = document.getElementById("shop-modal");
    const shopItemsContainer = document.getElementById("shop-items");
    const shopGoldLabel = document.getElementById("shop-gold");
    const shopMpRestoreBtn = document.getElementById("shop-mp-restore-btn");

    const gachaModal = document.getElementById("gacha-modal");
    const gacha100Btn = document.getElementById("gacha-100-btn");
    const gacha500Btn = document.getElementById("gacha-500-btn");
    const gacha1000Btn = document.getElementById("gacha-1000-btn");
    const gachaCloseBtn = document.getElementById("gacha-close-btn");
    const unlockArtifactSlotBtn = document.getElementById("unlock-artifact-slot-btn");
    const artifactsDisplay = document.getElementById("artifacts-display");

    const skilltreeModal = document.getElementById("skilltree-modal");
    const skilltreeCloseBtn = document.getElementById("skilltree-close-btn");

    // --- コンテニュー機能 ---
    if (Player.hasSaveData()) {
        continueBtn.style.display = "block";
        continueBtn.addEventListener("click", () => {
            player.loadGameData();
            currentJob = jobs[player.job];
            statusManager.recalculateStats();
            gameManager.currentStageIndex = player.currentStageIndex;
            gameManager.stageKillCount = player.stageKillCount;
            
            introScreen.style.display = "none";
            mainGameInterface.style.display = "block";
            gameManager.isGameRunning = true;
            updateLoopDisplay();
            encountEnemy();
        });
    }

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
        difficultySelectScreen.style.display = "block";
    }

    // 難易度選択
    document.getElementById("difficulty-easy").addEventListener("click", () => selectDifficulty("easy"));
    document.getElementById("difficulty-normal").addEventListener("click", () => selectDifficulty("normal"));
    document.getElementById("difficulty-hard").addEventListener("click", () => selectDifficulty("hard"));
    document.getElementById("difficulty-lunatic").addEventListener("click", () => selectDifficulty("lunatic"));
    document.getElementById("difficulty-inferno").addEventListener("click", () => selectDifficulty("inferno"));

    function selectDifficulty(difficulty) {
        // ニューゲーム+の場合は周回数をインクリメント
        if (window.isGameCleared) {
            player.loopCount++;
            window.isGameCleared = false;
        }

        player.setDifficulty(difficulty);
        difficultySelectScreen.style.display = "none";
        mainGameInterface.style.display = "block";
        gameManager.startGame();
        updateLoopDisplay();
        encountEnemy();
    }

    // --- 敵出現 ---
    function encountEnemy() {
        // ステージインデックスが範囲外の場合はリセット
        if (gameManager.currentStageIndex >= stages.length) {
            gameManager.currentStageIndex = stages.length - 1;
        }
        
        const stage = gameManager.getCurrentStage();
        console.log(`[敵出現] ステージ: ${stage.name} (Index: ${gameManager.currentStageIndex}), killCount: ${gameManager.stageKillCount}/${stage.reqKills}`);
        uiUpdater.updateStageName(stage.name);

        gameManager.resetMonsterState();

        // 現在のステージ情報を保存
        player.currentStageIndex = gameManager.currentStageIndex;
        player.stageKillCount = gameManager.stageKillCount;
        player.saveGameData();

        // ボス戦か判定
        if (gameManager.shouldFightBoss()) {
            console.log(`[ボス判定] shouldFightBoss = true`);
            if (gameManager.checkBossSpawn()) {
                // ボス戦
                gameManager.currentMonster = new Enemy(stage.boss, player.difficulty, player.loopCount);
                gameManager.monsterParty = [];
                gameManager.isMultiMonsterBattle = false;
                uiUpdater.setLog(`⚠ ${stage.boss.name} (BOSS) があらわれた！`);
                uiUpdater.applyBossName();
                uiUpdater.setSkillButtons(atkBtn, fireBtn, healBtn, currentJob, player);
            } else {
                // 通常敵
                console.log(`[ボス判定] ボス出現抽選失敗`);
                encountNormalEnemy(stage);
            }
        }
        // 謎解きモード判定
        else if (gameManager.checkPuzzleMode()) {
            console.log(`[謎解き判定] startPuzzle`);
            startPuzzle();
            return;
        }
        // 通常敵出現
        else if (gameManager.shouldEncounterNewEnemy()) {
            console.log(`[通常敵判定] shouldEncounterNewEnemy = true`);
            encountNormalEnemy(stage);
        } else {
            console.log(`[警告] 敵が出現していません - stageIndex: ${gameManager.currentStageIndex}, killCount: ${gameManager.stageKillCount}`);
        }

        uiUpdater.updateAll(player, statusManager, gameManager.currentMonster, gameManager);
    }

    function encountNormalEnemy(stage) {
        const selectedEnemy = Enemy.selectRandom(stage.enemies);
        gameManager.currentMonster = new Enemy(selectedEnemy, player.difficulty, player.loopCount);

        // 複数体出現イベント
        if (gameManager.checkMultiEnemyEvent()) {
            gameManager.isMultiMonsterBattle = true;
            gameManager.monsterParty = gameManager.generateEnemyParty(stage.enemies, stage, player.difficulty, player.loopCount);
            uiUpdater.setLog(`${gameManager.currentMonster.name} と仲間たちがあらわれた！`);
        } else {
            gameManager.isMultiMonsterBattle = false;
            gameManager.monsterParty = [];
            uiUpdater.setLog(`${gameManager.currentMonster.name} があらわれた！`);
        }

        uiUpdater.clearNameClass();
        if (gameManager.currentMonster.type === 'rare') uiUpdater.applyRareName();
        uiUpdater.setSkillButtons(atkBtn, fireBtn, healBtn, currentJob, player);
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

            // ボスドロップアイテム処理
            if (result.bossDropItems && result.bossDropItems.length > 0) {
                msg += `\n【ボスドロップ】`;
                result.bossDropItems.forEach(itemId => {
                    const item = shopItems.find(item => item.id === itemId);
                    if (item) {
                        msg += `\n${item.name}を手に入れた！`;
                    }
                });
            }

            // レベルアップ判定
            if (statusManager.canLevelUp()) {
                player.levelUp(player.job);
                msg += `\n【祝】レベルアップ！ Lv${player.level} になった！`;
                player.saveGameData();
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
                    
                    // ニューゲーム+表示
                    const currentLoopCount = player.loopCount;
                    msg += `\n\n【ニューゲーム+】\n難易度を選択して周回を始めますか？`;
                    
                    // ボタン処理を後で行うため、フラグを設定
                    window.isGameCleared = true;
                    window.clearedLoopCount = currentLoopCount;
                    
                    gameManager.currentStageIndex = 0;
                    gameManager.stageKillCount = 0;
                    player.currentStageIndex = 0;
                    player.stageKillCount = 0;
                    player.consecutiveWins = 0;
                } else {
                    msg += `\n=== ステージクリア！ ===\n次のエリアへ進みます。`;
                    // ボス倒却でステージを進める
                    gameManager.currentStageIndex++;
                    gameManager.stageKillCount = 0;
                    player.currentStageIndex = gameManager.currentStageIndex;
                    player.stageKillCount = 0;
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
            if (result.isFullLost) {
                // 完全敗北：ゲームオーバー
                Player.clearSaveData();
                // ゲーム状態をリセット
                gameManager.currentStageIndex = 0;
                gameManager.stageKillCount = 0;
            } else {
                // 単なる敗北：ステージの最初からコンテニュー
                // gameManagerもステージの最初にリセット
                gameManager.stageKillCount = 0;
                player.currentStageIndex = gameManager.currentStageIndex;
                player.stageKillCount = 0;
                player.saveGameData();
            }
            return true;
        }
        // 勝利時もセーブ
        player.currentStageIndex = gameManager.currentStageIndex;
        player.stageKillCount = gameManager.stageKillCount;
        player.saveGameData();
        return false;
    }

    // --- スキル実行 ---
    function executeSkill(skillIndex) {
        let skill;
        
        // activeSkills から習得スキルを取得
        const activeSkillId = player.activeSkills && player.activeSkills[skillIndex];
        if (activeSkillId) {
            // 習得スキルID から skilltree の情報を取得
            const tree = skillTreeConfig[player.job];
            if (tree) {
                const node = tree.nodes.find(n => n.id === activeSkillId);
                if (node) {
                    skill = {
                        name: node.name,
                        mp: node.mp,
                        type: node.type,
                        desc: node.desc
                    };
                } else {
                    // フォールバック：職業のデフォルトスキル
                    skill = currentJob.skills[skillIndex];
                }
            } else {
                skill = currentJob.skills[skillIndex];
            }
        } else {
            // activeSkills がなければ職業のデフォルトスキルを使用
            skill = currentJob.skills[skillIndex];
        }
        
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
        console.log(`[nextBtn] currentMonster: ${gameManager.currentMonster?.name}, isBoss: ${gameManager.currentMonster?.isBoss}`);
        
        // ボス倒却後かつファイナルボスの場合のみゲーム終了
        if (gameManager.currentMonster && gameManager.currentMonster.isBoss && gameManager.isFinalBoss()) {
            console.log(`[nextBtn] ファイナルボス倒却 - ゲーム終了`);
            // ゲーム終了
            introScreen.style.display = "flex";
            mainGameInterface.style.display = "none";
            Player.clearSaveData();
            location.reload();
        } else {
            console.log(`[nextBtn] 通常の次へ進む処理`);
            // 通常の次へ進むボタン処理
            resultArea.style.display = "none";
            actionArea.style.display = "flex";
            
            // 敵状態を完全にリセット
            gameManager.currentMonster = null;
            gameManager.monsterParty = [];
            gameManager.isMultiMonsterBattle = false;
            
            console.log(`[nextBtn] encountEnemy前: stageIndex=${gameManager.currentStageIndex}, killCount=${gameManager.stageKillCount}`);
            // 新しい敵を出現させる
            encountEnemy();
            enableButtons();
        }
    });

    // --- ショップシステム ---
    function renderShop() {
        shopItemsContainer.innerHTML = "";
        shopGoldLabel.textContent = player.gold;
        document.getElementById("job-name-shop").textContent = currentJob.name;

        // ボスドロップアイテム表示
        if (player.bossDropItems && player.bossDropItems.length > 0) {
            const bossDropSection = document.createElement("div");
            bossDropSection.style.cssText = "border-top: 2px solid #f39c12; padding-top: 15px; margin-top: 15px;";
            
            const title = document.createElement("div");
            title.textContent = "【ボスドロップ】";
            title.style.cssText = "font-weight: bold; color: #f39c12; margin-bottom: 10px;";
            bossDropSection.appendChild(title);

            player.bossDropItems.forEach((itemId, index) => {
                const item = shopItems.find(i => i.id === itemId);
                if (!item) return;

                const row = document.createElement("div");
                row.className = "shop-item";
                
                let desc = `${item.name} `;
                if (item.set) desc += `【${item.set}セット】`;
                if (item.type === 'atk') desc += `(攻+${item.val})`;
                if (item.type === 'def') desc += `(防+${item.val})`;
                if (item.type === 'matk') desc += `(魔+${item.val})`;

                const info = document.createElement("span");
                info.textContent = desc;

                const convertBtn = document.createElement("button");
                convertBtn.textContent = "装備";
                convertBtn.style.cssText = "background-color: #f39c12; cursor: pointer;";
                convertBtn.onclick = () => {
                    // ボスドロップを装備化
                    player.bossDropItems.splice(index, 1);
                    item.bought = true;
                    statusManager.recalculateStats();
                    uiUpdater.updatePlayerStatus(player, statusManager);
                    player.saveGameData();
                    renderShop();
                };

                row.appendChild(info);
                row.appendChild(convertBtn);
                bossDropSection.appendChild(row);
            });

            shopItemsContainer.appendChild(bossDropSection);
            
            const separator = document.createElement("div");
            separator.style.cssText = "border-top: 1px solid #ccc; margin-top: 15px; padding-top: 15px;";
            shopItemsContainer.appendChild(separator);
        }

        // 装備セット効果表示
        const activeSets = new Set();
        shopItems.forEach(item => {
            if (item.set && item.bought && (!item.jobs || item.jobs.includes(player.job))) {
                activeSets.add(item.set);
            }
        });

        if (activeSets.size > 0) {
            const setsSection = document.createElement("div");
            setsSection.style.cssText = "border-top: 2px solid #3498db; padding-top: 15px; margin-top: 15px; margin-bottom: 15px;";
            
            const setsTitle = document.createElement("div");
            setsTitle.textContent = "【装備セット効果】";
            setsTitle.style.cssText = "font-weight: bold; color: #3498db; margin-bottom: 10px;";
            setsSection.appendChild(setsTitle);

            activeSets.forEach(setName => {
                const setData = equipmentSets[setName];
                if (!setData) return;

                const setRow = document.createElement("div");
                setRow.style.cssText = "margin-bottom: 10px; padding: 8px; background-color: #ecf0f1; border-radius: 4px;";
                
                let setDesc = `${setName.charAt(0).toUpperCase() + setName.slice(1)}セット: `;
                const bonuses = [];
                if (setData.bonusAtk) bonuses.push(`攻+${setData.bonusAtk}`);
                if (setData.bonusDef) bonuses.push(`防+${setData.bonusDef}`);
                if (setData.bonusMatk) bonuses.push(`魔+${setData.bonusMatk}`);
                if (setData.bonusMp) bonuses.push(`MP+${setData.bonusMp}`);
                setDesc += bonuses.join(", ");

                // セット構成アイテムを表示
                const itemNames = setData.items
                    .map(id => shopItems.find(i => i.id === id)?.name)
                    .filter(Boolean)
                    .join(", ");
                setDesc += ` (${itemNames})`;

                setRow.textContent = setDesc;
                setsSection.appendChild(setRow);

                // セット選択ボタン
                const selectBtn = document.createElement("button");
                selectBtn.textContent = player.activeEquipSet === setName ? "✓ 有効" : "有効にする";
                selectBtn.style.cssText = `background-color: ${player.activeEquipSet === setName ? '#27ae60' : '#3498db'}; color: white; cursor: pointer; padding: 5px 10px; border-radius: 3px; margin-left: 10px;`;
                selectBtn.onclick = () => {
                    player.activeEquipSet = player.activeEquipSet === setName ? null : setName;
                    statusManager.recalculateStats();
                    uiUpdater.updatePlayerStatus(player, statusManager);
                    player.saveGameData();
                    renderShop();
                };

                setRow.appendChild(selectBtn);
                setsSection.appendChild(setRow);
            });

            shopItemsContainer.appendChild(setsSection);
            
            const separator = document.createElement("div");
            separator.style.cssText = "border-top: 1px solid #ccc; margin-top: 15px; padding-top: 15px;";
            shopItemsContainer.appendChild(separator);
        }

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
                        player.saveGameData();
                        renderShop();
                    }
                };
                if (player.gold < item.cost) buyBtn.disabled = true;
            }

            row.appendChild(info);
            row.appendChild(buyBtn);
            shopItemsContainer.appendChild(row);
        });

        // ガチャボタンをショップ下部に追加
        const separator = document.createElement("div");
        separator.style.cssText = "border-top: 1px solid #ccc; margin-top: 15px; padding-top: 15px;";
        shopItemsContainer.appendChild(separator);

        const gachaBtn = addGachaButtonToShop();
        shopItemsContainer.appendChild(gachaBtn);
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

    // スキルツリーボタン
    skilltreeBtn.addEventListener("click", () => {
        const jobKey = player.job;
        if (jobKey) {
            uiUpdater.renderSkillTree(player, jobKey);
            skilltreeModal.style.display = "flex";
            disableButtons();
        }
    });

    skilltreeCloseBtn.addEventListener("click", () => {
        skilltreeModal.style.display = "none";
        player.saveGameData(); // スキルツリーでの変更を保存
        uiUpdater.updatePlayerStatus(player, statusManager);
        uiUpdater.setSkillButtons(atkBtn, fireBtn, healBtn, currentJob, player);
        enableButtons();
    });

    // --- ガチャシステム ---
    function renderGacha() {
        document.getElementById("gacha-gold").textContent = player.gold;
        document.getElementById("artifact-count").textContent = player.artifacts.length;
        document.getElementById("artifact-slots").textContent = player.artifactSlots;
        document.getElementById("artifact-slots-display").textContent = player.artifactSlots;

        const nextSlotCost = artifactSlotUnlockCosts[player.artifactSlots] || 0;
        document.getElementById("unlock-cost").textContent = nextSlotCost;

        // 装備中のアーティファクト表示
        artifactsDisplay.innerHTML = "";
        player.artifacts.forEach((artifactId, index) => {
            const artifact = getArtifactById(artifactId);
            if (!artifact) return;

            const row = document.createElement("div");
            row.style.cssText = "padding:8px; margin-bottom:5px; background-color:#f0f0f0; border-radius:3px; display:flex; justify-content:space-between; align-items:center;";
            
            let rarityColor = "#ccc";
            if (artifact.rarity === 5) rarityColor = "#f39c12";
            else if (artifact.rarity === 4) rarityColor = "#9b59b6";
            else if (artifact.rarity === 3) rarityColor = "#3498db";
            
            const info = document.createElement("span");
            info.textContent = `${artifact.icon} ${artifact.name} (★${artifact.rarity})`;
            info.style.color = rarityColor;
            
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "外す";
            removeBtn.style.cssText = "padding:3px 8px; font-size:0.8rem; cursor:pointer;";
            removeBtn.onclick = () => {
                player.artifacts.splice(index, 1);
                statusManager.recalculateStats();
                uiUpdater.updatePlayerStatus(player, statusManager);
                player.saveGameData();
                renderGacha();
            };

            row.appendChild(info);
            row.appendChild(removeBtn);
            artifactsDisplay.appendChild(row);
        });
    }

    function drawGacha(tier) {
        const result = shopSystem.drawGacha(tier, player);
        
        if (!result.success) {
            uiUpdater.setLog(result.message);
            return;
        }

        // ガチャ結果ダイアログ
        let rarity = result.artifact.rarity;
        let rarityText = ["", "★", "★★", "★★★", "★★★★", "★★★★★"];
        let rarityColor = "#ccc";
        if (rarity === 5) rarityColor = "#f39c12";
        else if (rarity === 4) rarityColor = "#9b59b6";
        else if (rarity === 3) rarityColor = "#3498db";
        else if (rarity === 2) rarityColor = "#2ecc71";

        alert(`🎉 ${rarityText[rarity]} ${result.artifact.name}\n\n${result.artifact.icon} ${result.message}`);

        // 装備中でない場合の質問
        if (result.newSlot) {
            if (confirm("装備枠が満杯です。枠を解放しますか？")) {
                const unlockResult = shopSystem.unlockArtifactSlot(player);
                if (unlockResult.success) {
                    uiUpdater.setLog(unlockResult.message);
                }
            }
        }

        statusManager.recalculateStats();
        uiUpdater.updatePlayerStatus(player, statusManager);
        player.saveGameData();
        renderGacha();
    }

    // ガチャボタンイベント
    gacha100Btn.addEventListener("click", () => drawGacha(100));
    gacha500Btn.addEventListener("click", () => drawGacha(500));
    gacha1000Btn.addEventListener("click", () => drawGacha(1000));

    unlockArtifactSlotBtn.addEventListener("click", () => {
        if (player.artifactSlots >= 5) {
            alert("装備枠は既に最大です");
            return;
        }
        const result = shopSystem.unlockArtifactSlot(player);
        if (result.success) {
            alert(result.message);
            statusManager.recalculateStats();
            uiUpdater.updatePlayerStatus(player, statusManager);
            player.saveGameData();
            renderGacha();
        } else {
            alert(result.message);
        }
    });

    // ガチャモーダルイベント
    shopOpenBtn.addEventListener("click", () => {
        shopModal.style.display = "flex";
        renderShop();
    });

    shopCloseBtn.addEventListener("click", () => {
        shopModal.style.display = "none";
    });

    gachaCloseBtn.addEventListener("click", () => {
        gachaModal.style.display = "none";
    });

    // ショップにガチャボタンを追加（ゲーム開始後）
    function addGachaButtonToShop() {
        const gachaBtn = document.createElement("button");
        gachaBtn.textContent = "🎰 アーティファクトガチャ";
        gachaBtn.style.cssText = "width:100%; padding:10px; margin-top:10px; background-color:#f39c12; font-weight:bold; cursor:pointer;";
        gachaBtn.onclick = () => {
            shopModal.style.display = "none";
            gachaModal.style.display = "flex";
            renderGacha();
        };
        return gachaBtn;
    }

    // 周回表示更新
    function updateLoopDisplay() {
        document.getElementById("loop-count-display").textContent = `周回: ${player.loopCount}`;
    }
};

