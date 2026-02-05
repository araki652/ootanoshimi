// ショップシステム
class ShopSystem {
    constructor() {
        this.isOpen = false;
    }

    // ショップを開く
    openShop() {
        this.isOpen = true;
    }

    // ショップを閉じる
    closeShop() {
        this.isOpen = false;
    }

    // アイテムを購入
    buyItem(itemId, player) {
        const item = shopItems.find(i => i.id === itemId);
        
        if (!item) {
            return { success: false, message: "アイテムが見つかりません" };
        }

        if (player.gold < item.cost) {
            return { success: false, message: "ゴールドが足りません" };
        }

        if (item.bought && !item.repeatable) {
            return { success: false, message: "既に購入済みです" };
        }

        // 購入処理
        player.gold -= item.cost;

        switch(item.type) {
            case 'heal':
                player.recoverHp(item.val);
                player.recoverMp(item.val);
                break;
            case 'mpRestore':
                player.recoverMp(item.val);
                break;
            case 'ailment':
                player.cureAilment(item.val);
                break;
            case 'mpUp':
                player.maxMp += item.val;
                player.recoverMp(item.val);
                break;
        }

        if (!item.repeatable) {
            item.bought = true;
        }

        return { success: true, message: `${item.name}を購入しました！` };
    }

    // 購入可能なアイテムをフィルタリング
    getAvailableItems(job) {
        return shopItems.filter(item => {
            if (item.jobs && !item.jobs.includes(job)) {
                return false;
            }
            return true;
        });
    }

    // 職業別装備を取得
    getJobEquipment(job) {
        return shopItems.filter(item => {
            if (item.type === 'heal' || item.type === 'mpRestore' || item.type === 'ailment' || item.type === 'mpUp' || item.type === 'mpRecover') {
                return false; // 消耗品・回復系は除外
            }
            if (item.jobs && !item.jobs.includes(job)) {
                return false;
            }
            return true;
        });
    }

    // 消耗品を取得
    getConsumables() {
        return shopItems.filter(item => {
            return item.type === 'heal' || item.type === 'mpRestore' || item.type === 'ailment' || item.type === 'mpUp' || item.type === 'mpRecover';
        });
    }

    // MP回復薬を購入
    buyMpRestorePotion(player) {
        const potion = shopItems.find(i => i.id === 'p3'); // MP回復薬
        
        if (!potion) {
            return { success: false, message: "MP回復薬が見つかりません" };
        }

        if (player.gold < potion.cost) {
            return { success: false, message: "ゴールドが足りません" };
        }

        player.gold -= potion.cost;
        player.recoverMp(potion.val);

        return { success: true, message: "MP回復薬を使用した" };
    }

    // 装備の統計情報を取得
    getEquipmentStats(job) {
        const equipment = this.getJobEquipment(job);
        let totalAtk = 0;
        let totalDef = 0;
        let totalMatk = 0;

        equipment.forEach(item => {
            if (item.bought) {
                if (item.type === 'atk') totalAtk += item.val;
                if (item.type === 'def') totalDef += item.val;
                if (item.type === 'matk') totalMatk += item.val;
            }
        });

        return { totalAtk, totalDef, totalMatk };
    }

    // 購入済みアイテム数
    getPurchasedItemCount(job) {
        const equipment = this.getJobEquipment(job);
        return equipment.filter(item => item.bought).length;
    }

    // 装備セット効果を確認
    checkEquipmentSetBonuses() {
        const activeSets = [];

        Object.keys(equipmentSets).forEach(setName => {
            const set = equipmentSets[setName];
            let matchCount = 0;

            set.items.forEach(itemId => {
                const item = shopItems.find(i => i.id === itemId && i.bought);
                if (item) matchCount++;
            });

            if (matchCount === set.items.length) {
                activeSets.push({ setName, bonuses: set });
            }
        });

        return activeSets;
    }

    // ガチャを引く
    drawGacha(tier, player) {
        // tier: 100, 500, 1000
        const rates = gachaRates[tier];
        if (!rates) {
            return { success: false, message: "無効なガチャです" };
        }

        // プレイヤーのゴールドをチェック
        if (player.gold < tier) {
            return { success: false, message: `ゴールドが足りません（必要: ${tier}G）` };
        }

        // ゴールド消費
        player.gold -= tier;

        // レアリティを抽選
        let rarity = 1;
        const random = Math.random();
        let cumulative = 0;

        for (const [rar, rate] of Object.entries(rates)) {
            cumulative += rate;
            if (random < cumulative) {
                rarity = parseInt(rar);
                break;
            }
        }

        // 該当レアリティのアーティファクトを抽選
        const candidates = getArtifactsByRarityAndTier(rarity, tier);
        if (candidates.length === 0) {
            return { success: false, message: "該当するアーティファクトがありません" };
        }

        const artifact = candidates[Math.floor(Math.random() * candidates.length)];

        // プレイヤーのアーティファクトリストに追加
        if (player.artifacts.length < player.artifactSlots) {
            player.artifacts.push(artifact.id);
            return {
                success: true,
                artifact: artifact,
                message: `${artifact.name} を手に入れた！`,
                newSlot: false
            };
        } else {
            // 枠が満杯の場合は別途処理が必要
            return {
                success: true,
                artifact: artifact,
                message: `${artifact.name} を手に入れたが、装備枠が満杯です`,
                newSlot: true
            };
        }
    }

    // アーティファクト枠を解放
    unlockArtifactSlot(player) {
        if (player.artifactSlots >= 5) {
            return { success: false, message: "装備枠は既に最大です" };
        }

        const cost = artifactSlotUnlockCosts[player.artifactSlots];
        if (player.gold < cost) {
            return { success: false, message: `ゴールドが足りません（必要: ${cost}G）` };
        }

        player.gold -= cost;
        player.artifactSlots++;

        return {
            success: true,
            message: `装備枠を解放しました！ (${player.artifactSlots}/5)`,
            cost: cost
        };
    }

    // アーティファクトを装備/外す
    equipArtifact(artifactId, player) {
        // 既に装備中か確認
        const index = player.artifacts.indexOf(artifactId);
        if (index !== -1) {
            player.artifacts.splice(index, 1);
            return { success: true, message: "アーティファクトを外しました" };
        } else {
            // 新たに装備
            if (player.artifacts.length >= player.artifactSlots) {
                return { success: false, message: "装備枠がいっぱいです" };
            }
            player.artifacts.push(artifactId);
            return { success: true, message: "アーティファクトを装備しました" };
        }
    }
}

