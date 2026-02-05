// バトル処理システム
class BattleSystem {
    static calculateDamage(atk, def, type) {
        // ミス判定
        if (type === 'phys' && Math.random() < 0.1) {
            return { val: 0, isCrit: false, isMiss: true };
        }
        
        // 超高防御判定
        if (def > 900) {
            return { val: Math.random() < 0.5 ? 1 : 0, isCrit: false, isMiss: false };
        }

        let base = atk - (def / 2);
        if (base < 1) base = 1;

        // クリティカル判定
        let isCrit = false;
        if (Math.random() < 0.1) {
            base *= 1.5;
            isCrit = true;
        }

        // ダメージ変動
        const variance = Math.floor(base * 0.1);
        let final = Math.floor(base + Math.random() * (variance * 2 + 1) - variance);
        if (final < 1) final = 1;
        
        return { val: final, isCrit: isCrit, isMiss: false };
    }

    // 連勝ボーナス取得
    static getConsecutiveWinBonus(consecutiveWins) {
        let bonus = 1.0;
        if (consecutiveWins >= 5) {
            bonus = 1.2;
        } else if (consecutiveWins >= 3) {
            bonus = 1.1;
        }
        return bonus;
    }

    // スキル実行（簡略版 - 詳細は個別スキル関数で実装）
    static executeSkill(skill, player, enemy, currentJob) {
        let damage = 0;
        let message = "";
        let effect = null;

        switch(skill.type) {
            case "normalAttack": // 全職業：通常攻撃
                const resNormal = BattleSystem.calculateDamage(player.atk, enemy.def, 'phys');
                damage = resNormal.val;
                message = `${skill.name}！ ${damage}のダメージ！`;
                if (resNormal.isCrit) message = "★会心の一撃！ " + message;
                break;

            case "atkUp": // 戦士：大斬撃
                const res1 = BattleSystem.calculateDamage(player.atk * 1.5, enemy.def, 'phys');
                damage = res1.val;
                message = `${skill.name}！ ${damage}のダメージ！`;
                if (res1.isCrit) message = "★会心の一撃！ " + message;
                break;

            case "doubleAtk": // 戦士：連撃
                const res2a = BattleSystem.calculateDamage(player.atk * 0.8, enemy.def, 'phys');
                const res2b = BattleSystem.calculateDamage(player.atk * 0.8, enemy.def, 'phys');
                damage = res2a.val + res2b.val;
                message = `${skill.name}！ ${damage}のダメージ！`;
                break;

            case "defense": // 戦士：鉄壁
                player.def += Math.floor(player.def * 0.5);
                message = `${skill.name}！ 防御力UP！`;
                break;

            case "fire": // 魔法使い：ファイアボール
                const res3 = BattleSystem.calculateDamage(player.matk, enemy.mdef, 'magic');
                damage = res3.val;
                message = `${skill.name}！ ${damage}のダメージ！`;
                break;

            case "freeze": // 魔法使い：フリーズ
                const res4 = BattleSystem.calculateDamage(player.matk * 0.7, enemy.mdef, 'magic');
                damage = res4.val;
                if (Math.random() < 0.6) {
                    effect = 'paralysis';
                    message = `${skill.name}！ ${damage}のダメージ！敵は麻痺！`;
                } else {
                    message = `${skill.name}！ ${damage}のダメージ！`;
                }
                break;

            case "mpRestore": // 魔法使い：マナストール
                const mpSteal = Math.floor(enemy.atk / 3) + 3;
                player.recoverMp(mpSteal);
                const res5 = BattleSystem.calculateDamage(player.matk * 0.4, enemy.mdef, 'magic');
                damage = res5.val;
                message = `${skill.name}！ ${mpSteal}MP吸収＆${damage}ダメージ！`;
                break;

            case "shield": // 聖騎士：ホーリーシールド
                const heal1 = 30 + (player.level * 2);
                player.recoverHp(heal1);
                message = `${skill.name}！ HP${heal1}回復！`;
                break;

            case "holyStrike": // 聖騎士：聖なる一撃
                const res6 = BattleSystem.calculateDamage(player.atk * 1.2, enemy.def, 'phys');
                damage = res6.val;
                const heal2 = Math.floor(damage / 2);
                player.recoverHp(heal2);
                message = `${skill.name}！ ${damage}ダメージ＆${heal2}吸収！`;
                break;

            case "resurrect": // 聖騎士：リザレクション
                player.recoverHp(50);
                player.recoverMp(10);
                player.clearAllAilments();
                message = `${skill.name}！ 完全回復！`;
                break;

            case "quickStrike": // 暗殺者：急速剣
                const qAtk = BattleSystem.calculateDamage(player.atk * 1.3, enemy.def, 'phys');
                damage = qAtk.val;
                message = `${skill.name}！ ${damage}ダメージ！`;
                break;

            case "shadowClone": // 暗殺者：影分身
                effect = 'evasion';
                message = `${skill.name}！ 敵の攻撃を回避！`;
                break;

            case "finalBlow": // 暗殺者：致命の一撃
                if (Math.random() < 0.5) {
                    damage = BattleSystem.calculateDamage(player.atk * 2.5, enemy.def, 'phys').val;
                    message = `${skill.name}！ ★必殺！ ${damage}ダメージ！`;
                } else {
                    damage = BattleSystem.calculateDamage(player.atk * 1.5, enemy.def, 'phys').val;
                    message = `${skill.name}！ ${damage}ダメージ！`;
                }
                break;

            case "holyLight": // ビショップ：聖光
                const hlDmg = BattleSystem.calculateDamage(player.matk * 0.8, enemy.mdef, 'magic');
                damage = hlDmg.val;
                const hlHeal = Math.floor(damage * 0.6);
                player.recoverHp(hlHeal);
                message = `${skill.name}！ ${damage}ダメージ＆${hlHeal}回復！`;
                break;

            case "blessing": // ビショップ：祝福
                player.atk += Math.floor(player.atk * 0.2);
                player.def += Math.floor(player.def * 0.2);
                player.matk += Math.floor(player.matk * 0.2);
                message = `${skill.name}！ 全ステータスUP！`;
                break;

            case "dimensionDoor": // ビショップ：次元の扉
                player.hp = player.maxHp;
                player.mp = player.maxMp;
                player.clearAllAilments();
                message = `${skill.name}！ 全復旧！`;
                break;
        }

        return { damage, message, effect };
    }

    // 敵の攻撃処理
    static executeEnemyAttack(enemy, player) {
        let attackDmg = enemy.atk;
        
        // 麻痺状態なら威力低下
        if (player.hasAilment('paralysis')) {
            attackDmg = Math.floor(attackDmg * 0.6);
            if (Math.random() < 0.4) player.cureAilment('paralysis');
        }

        const res = BattleSystem.calculateDamage(attackDmg, player.def, 'phys');
        
        let message = "";
        if (res.isMiss) {
            message = `ミス！ ${enemy.name}の攻撃をかわした！`;
        } else {
            let damageMsg = `${enemy.name}の攻撃！ ${res.val} のダメージ！`;
            if (res.isCrit) {
                message = "\n★痛恨の一撃！ " + damageMsg;
            } else {
                message = damageMsg;
            }

            // 毒付与判定
            if (Math.random() < 0.15 && !player.hasAilment('poison')) {
                player.applyAilment('poison');
                message += "\n毒に侵された！";
            }
        }

        return { damage: res.val, message };
    }

    // 毒ダメージ処理
    static processPoisonDamage(player) {
        if (player.hasAilment('poison')) {
            const poisonDmg = 3;
            player.takeDamage(poisonDmg);
            return { damage: poisonDmg, message: `【毒】${poisonDmg}のダメージ！` };
        }
        return null;
    }
}
