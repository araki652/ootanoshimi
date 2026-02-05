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
    updateEnemyStatus(enemy, isPuzzleMode, isMultiMonsterBattle, monsterParty) {
        if (isPuzzleMode) {
            this.mNameLabel.textContent = "謎の門番";
            this.mHpBar.value = 100;
            this.mHpBar.max = 100;
            this.mHpNow.textContent = "??";
            this.mHpMax.textContent = "??";
            this.monsterPartyElement.style.display = "none";
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
    setSkillButtons(atkBtn, fireBtn, healBtn, currentJob) {
        const jobSkills = currentJob.skills;
        atkBtn.textContent = `${jobSkills[0].name}(${jobSkills[0].mp}MP)`;
        fireBtn.textContent = `${jobSkills[1].name}(${jobSkills[1].mp}MP)`;
        healBtn.textContent = `${jobSkills[2].name}(${jobSkills[2].mp}MP)`;
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

    // 全体更新
    updateAll(player, statusManager, enemy, gameManager) {
        this.updatePlayerStatus(player, statusManager);
        this.updateEnemyStatus(enemy, gameManager.isPuzzleMode, gameManager.isMultiMonsterBattle, gameManager.monsterParty);
        this.updateStageName(gameManager.getCurrentStage().name);
    }
}
