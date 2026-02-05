// UI更新ユーティリティ
class UIUpdater {
    constructor() {
        // DOM要素キャッシュ
        this.mNameLabel = document.getElementById("m-name");
        this.mHpBar = document.getElementById("m-hp-bar");
        this.mHpNow = document.getElementById("m-hp-now");
        this.mHpMax = document.getElementById("m-hp-max");
        this.monsterPartyElement = document.getElementById("monster-party");

        this.pNameLabel = document.getElementById("p-name");
        this.pHpBar = document.getElementById("p-hp-bar");
        this.pHpNow = document.getElementById("p-hp-now");
        this.pHpMax = document.getElementById("p-hp-max");
        this.pMpBar = document.getElementById("p-mp-bar");
        this.pMpNow = document.getElementById("p-mp-now");
        this.pMpMax = document.getElementById("p-mp-max");
        
        this.pLevelLabel = document.getElementById("p-level");
        this.pExpNextLabel = document.getElementById("p-exp-next");
        this.pAtkLabel = document.getElementById("p-atk");
        this.pDefLabel = document.getElementById("p-def");

        this.logElement = document.getElementById("message-log");
        this.stageNameLabel = document.getElementById("stage-name");
        this.goldDisplay = document.getElementById("gold-display");
    }

    // プレイヤーステータスを更新
    updatePlayerStatus(player, statusManager) {
        this.pNameLabel.textContent = player.name;
        this.pLevelLabel.textContent = player.level;
        this.pHpBar.value = player.hp;
        this.pHpBar.max = player.maxHp;
        this.pHpNow.textContent = player.hp;
        this.pHpMax.textContent = player.maxHp;
        
        this.pMpBar.value = player.mp;
        this.pMpBar.max = player.maxMp;
        this.pMpNow.textContent = player.mp;
        this.pMpMax.textContent = player.maxMp;
        
        this.pAtkLabel.textContent = player.atk;
        this.pDefLabel.textContent = player.def;
        this.goldDisplay.textContent = player.gold + " G";

        // スキルポイント表示を更新
        const skillPointsDisplay = document.getElementById("skill-points-display");
        if (skillPointsDisplay) {
            if (player.skillPoints > 0) {
                skillPointsDisplay.textContent = `SP: ${player.skillPoints}`;
                skillPointsDisplay.style.color = "#f1c40f";
            } else {
                skillPointsDisplay.textContent = "SP: 0";
                skillPointsDisplay.style.color = "#9b59b6";
            }
        }

        const remain = statusManager.getExpToNextLevel();
        this.pExpNextLabel.textContent = remain;

        // 低HP時のクラス付与
        if (statusManager.isLowHp()) {
            this.pHpNow.parentElement.classList.add("low-hp");
        } else {
            this.pHpNow.parentElement.classList.remove("low-hp");
        }
    }

    // 敵ステータスを更新
    updateEnemyStatus(enemy, isPuzzleMode = false, isMultiMonsterBattle = false, monsterParty = []) {
        if (isPuzzleMode) {
            this.mNameLabel.textContent = "謎の門番";
            this.mHpBar.value = 100;
            this.mHpBar.max = 100;
            this.mHpNow.textContent = "??";
            this.mHpMax.textContent = "??";
            this.monsterPartyElement.style.display = "none";
        } else if (!enemy) {
            // 敵がnullの場合は何もしない
            return;
        } else {
            this.mNameLabel.textContent = enemy.name;
            this.mHpBar.value = enemy.hp;
            this.mHpBar.max = enemy.maxHp;
            this.mHpNow.textContent = enemy.hp;
            this.mHpMax.textContent = enemy.maxHp;
            
            // 複数体表示
            if (isMultiMonsterBattle && monsterParty.length > 0) {
                this.monsterPartyElement.style.display = "block";
                this.monsterPartyElement.innerHTML = `<div style="font-size:0.85rem; color:#aaa; margin-bottom:8px;">複数体との戦闘！（残り${monsterParty.length}体）</div>`;
                monsterParty.forEach((m, idx) => {
                    const hpPercent = Math.ceil((m.hp / m.maxHp) * 100);
                    const entryHTML = `
                        <div class="monster-entry">
                            <span class="monster-entry-name">${idx + 1}. ${m.name}</span>
                            <span class="monster-entry-hp">HP: ${m.hp}/${m.maxHp} (${hpPercent}%)</span>
                        </div>
                    `;
                    this.monsterPartyElement.innerHTML += entryHTML;
                });
            } else {
                this.monsterPartyElement.style.display = "none";
            }
        }

        // 低HP敵時のクラス付与
        if (!isPuzzleMode && enemy.getHpRatio() <= 0.2) {
            this.mHpNow.parentElement.classList.add("low-hp");
        } else {
            this.mHpNow.parentElement.classList.remove("low-hp");
        }
    }

    // ステージ名を更新
    updateStageName(stageName) {
        this.stageNameLabel.textContent = `ステージ: ${stageName}`;
    }

    // ログメッセージを追加
    addLog(message) {
        this.logElement.textContent += `\n${message}`;
        this.logElement.scrollTop = this.logElement.scrollHeight;
    }

    // ログをクリア
    clearLog() {
        this.logElement.textContent = "";
    }

    // ログをセット
    setLog(message) {
        this.logElement.textContent = message;
    }

    // ボスネームを適用
    applyBossName() {
        this.mNameLabel.className = "boss-name";
    }

    // レアネームを適用
    applyRareName() {
        this.mNameLabel.className = "rare-name";
    }

    // ネームクラスをクリア
    clearNameClass() {
        this.mNameLabel.className = "";
    }

    // MP不足時の点滅エフェクト
    flashMpBar() {
        this.pMpBar.classList.add("no-mp");
        setTimeout(() => {
            this.pMpBar.classList.remove("no-mp");
        }, 800);
    }

    // スキルボタンテキストを更新（バトルモード）
    setSkillButtons(atkBtn, fireBtn, healBtn, currentJob, player = null) {
        const jobSkills = currentJob.skills;
        
        // プレイヤーが指定されていて、activeSkillsが設定されている場合
        if (player && player.activeSkills) {
            // activeSkillsから実際のスキル情報を取得
            const skillSlots = [];
            
            player.activeSkills.forEach((skillId, index) => {
                if (skillId) {
                    // スキルツリーから該当スキルを検索
                    const tree = skillTreeConfig[player.job];
                    if (tree) {
                        const node = tree.nodes.find(n => n.id === skillId);
                        if (node) {
                            skillSlots[index] = {
                                name: node.name,
                                mp: node.mp,
                                icon: node.icon,
                                id: skillId
                            };
                        }
                    }
                } else {
                    // スロットが空の場合はデフォルトスキルを使用
                    skillSlots[index] = {
                        name: jobSkills[index].name,
                        mp: jobSkills[index].mp,
                        icon: "",
                        id: null
                    };
                }
            });
            
            // ボタン表示を更新
            if (skillSlots[0]) {
                atkBtn.textContent = skillSlots[0].icon 
                    ? `${skillSlots[0].icon} ${skillSlots[0].name}(${skillSlots[0].mp}MP)` 
                    : `${skillSlots[0].name}(${skillSlots[0].mp}MP)`;
            }
            if (skillSlots[1]) {
                fireBtn.textContent = skillSlots[1].icon 
                    ? `${skillSlots[1].icon} ${skillSlots[1].name}(${skillSlots[1].mp}MP)` 
                    : `${skillSlots[1].name}(${skillSlots[1].mp}MP)`;
            }
            if (skillSlots[2]) {
                healBtn.textContent = skillSlots[2].icon 
                    ? `${skillSlots[2].icon} ${skillSlots[2].name}(${skillSlots[2].mp}MP)` 
                    : `${skillSlots[2].name}(${skillSlots[2].mp}MP)`;
            }
        } else {
            // プレイヤーが指定されていない場合はデフォルト
            atkBtn.textContent = `${jobSkills[0].name}(${jobSkills[0].mp}MP)`;
            fireBtn.textContent = `${jobSkills[1].name}(${jobSkills[1].mp}MP)`;
            healBtn.textContent = `${jobSkills[2].name}(${jobSkills[2].mp}MP)`;
        }
        
        fireBtn.classList.add("magic-btn");
        healBtn.classList.add("heal-btn");
    }

    // スキルボタンテキストを更新（謎解きモード）
    setPuzzleButtons(atkBtn, fireBtn, healBtn, riddle) {
        atkBtn.textContent = `A: ${riddle.options[0]}`;
        fireBtn.textContent = `B: ${riddle.options[1]}`;
        healBtn.textContent = `C: ${riddle.options[2]}`;
        fireBtn.classList.remove("magic-btn");
        healBtn.classList.remove("heal-btn");
    }

    // スキルツリーを描画
    renderSkillTree(player, jobKey) {
        const skilltreeJobName = document.getElementById("skilltree-job-name");
        const skillPoints = document.getElementById("skill-points");
        const skilltreeNodesDiv = document.getElementById("skilltree-nodes");

        if (!skilltreeJobName || !skillPoints || !skilltreeNodesDiv) return;

        skilltreeJobName.textContent = skillTreeConfig[jobKey].name;
        skillPoints.innerHTML = `<span style="color:#f1c40f; font-weight:bold;">スキルポイント: ${player.skillPoints}</span>`;
        skilltreeNodesDiv.innerHTML = "";

        const tree = skillTreeConfig[jobKey];
        tree.nodes.forEach(node => {
            const nodeDiv = document.createElement("div");
            nodeDiv.style.cssText = "border: 2px solid #555; padding: 12px; border-radius: 5px; font-size: 0.85rem; margin-bottom: 8px;";

            const isLearned = player.hasSkill(node.id);
            const costSP = node.cost || 1;  // デフォルト1SP
            const canLearn = player.level >= node.level && player.skillPoints >= costSP && !isLearned;
            const prereqMet = node.prerequisites.every(prereq => player.hasSkill(prereq));

            // 背景色設定
            if (isLearned) {
                nodeDiv.style.backgroundColor = "#1a4d1a";
                nodeDiv.style.borderColor = "#2ecc71";
            } else if (!prereqMet) {
                nodeDiv.style.backgroundColor = "#2a2a2a";
                nodeDiv.style.opacity = "0.6";
                nodeDiv.style.borderColor = "#555";
            } else if (canLearn) {
                nodeDiv.style.backgroundColor = "#1a3a5a";
                nodeDiv.style.borderColor = "#3498db";
            } else {
                nodeDiv.style.backgroundColor = "#3a3a3a";
                nodeDiv.style.borderColor = "#666";
            }

            const nameText = `${node.icon} ${node.name}`;
            const levelReqText = `必要レベル: Lv${node.level}`;
            const mpText = `戦闘時MP消費: ${node.mp}`;
            const costText = `習得コスト: ${costSP} SP`;
            const descText = `${node.desc}`;

            let statusText = "";
            let statusColor = "#fff";
            
            if (isLearned) {
                statusText = "✓ 習得済み";
                statusColor = "#2ecc71";
            } else if (!prereqMet) {
                const unmetPrereqs = node.prerequisites
                    .filter(prereq => !player.hasSkill(prereq))
                    .map(prereq => {
                        const prereqNode = tree.nodes.find(n => n.id === prereq);
                        return prereqNode ? prereqNode.name : prereq;
                    })
                    .join(", ");
                statusText = `先に習得が必要: ${unmetPrereqs}`;
                statusColor = "#ff6b6b";
            } else if (canLearn) {
                statusText = "✓ 習得可能！";
                statusColor = "#2ecc71";
            } else {
                statusText = `Lv${node.level}に達したか、SP${costSP}が必要`;
                statusColor = "#f39c12";
            }

            nodeDiv.innerHTML = `
                <div style="font-weight:bold; font-size:0.95rem; margin-bottom:6px; color:#fff;">${nameText}</div>
                <div style="color:#aaa; font-size:0.75rem; margin-bottom:6px; line-height:1.4;">${descText}</div>
                <div style="color:#ddd; font-size:0.8rem; margin-bottom:4px;">📍 ${levelReqText}</div>
                <div style="color:#ddd; font-size:0.8rem; margin-bottom:4px;">⚔ ${mpText}</div>
                <div style="color:#f1c40f; font-size:0.8rem; margin-bottom:8px;">💎 ${costText}</div>
                <div style="color:${statusColor}; font-weight:bold; font-size:0.85rem; margin-bottom:8px; padding:6px; background-color:rgba(0,0,0,0.3); border-radius:3px;">${statusText}</div>
            `;

            if (canLearn) {
                const btnLearn = document.createElement("button");
                btnLearn.textContent = `スキルを習得 (-${costSP} SP)`;
                btnLearn.style.cssText = "width:100%; padding:8px; background-color:#2ecc71; border-color:#2ecc71; color:#000; cursor:pointer; border: 2px solid #2ecc71; font-weight:bold; border-radius:3px; transition:all 0.2s;";
                btnLearn.onmouseover = () => { btnLearn.style.backgroundColor = "#27ae60"; };
                btnLearn.onmouseout = () => { btnLearn.style.backgroundColor = "#2ecc71"; };
                btnLearn.onclick = () => {
                    if (player.learnSkill(node.id)) {
                        player.consumeSkillPoints(costSP);
                        
                        // 習得スキルを最初の空きslotに登録
                        for (let i = 0; i < 3; i++) {
                            if (!player.activeSkills[i]) {
                                player.activeSkills[i] = node.id;
                                break;
                            }
                        }
                        
                        this.renderSkillTree(player, jobKey);
                    }
                };
                nodeDiv.appendChild(btnLearn);
            } else if (isLearned) {
                // 習得済みスキルの場合、slot管理ボタンを表示
                const slotContainer = document.createElement("div");
                slotContainer.style.cssText = "display:flex; gap:5px; font-size:0.75rem;";
                
                for (let slotIndex = 0; slotIndex < 3; slotIndex++) {
                    const isInSlot = player.activeSkills[slotIndex] === node.id;
                    const btnSlot = document.createElement("button");
                    btnSlot.textContent = isInSlot ? `スロット${slotIndex+1} ✓` : `スロット${slotIndex+1}`;
                    btnSlot.style.cssText = `flex:1; padding:6px; border-color:${isInSlot ? '#2ecc71' : '#888'}; color:${isInSlot ? '#2ecc71' : '#fff'}; background-color:${isInSlot ? 'rgba(46,204,113,0.1)' : '#222'}; cursor:pointer; border: 1px solid; font-weight:${isInSlot ? 'bold' : 'normal'}; border-radius:3px; transition:all 0.2s;`;
                    btnSlot.onmouseover = () => { btnSlot.style.backgroundColor = isInSlot ? 'rgba(46,204,113,0.2)' : '#333'; };
                    btnSlot.onmouseout = () => { btnSlot.style.backgroundColor = isInSlot ? 'rgba(46,204,113,0.1)' : '#222'; };
                    
                    btnSlot.onclick = () => {
                        if (isInSlot) {
                            // slotから削除
                            player.activeSkills[slotIndex] = null;
                        } else {
                            // slotに登録
                            player.activeSkills[slotIndex] = node.id;
                        }
                        this.renderSkillTree(player, jobKey);
                    };
                    slotContainer.appendChild(btnSlot);
                }
                
                nodeDiv.appendChild(slotContainer);
            }

            skilltreeNodesDiv.appendChild(nodeDiv);
        });
    }

    // 全体更新
    updateAll(player, statusManager, enemy, gameManager) {
        this.updatePlayerStatus(player, statusManager);
        this.updateEnemyStatus(enemy, gameManager.isPuzzleMode, gameManager.isMultiMonsterBattle, gameManager.monsterParty);
        this.updateStageName(gameManager.getCurrentStage().name);
    }
}
