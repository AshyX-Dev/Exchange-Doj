// fetch("https://apilist.tronscanapi.com/api/accountv2?address=TG5wUqBkukAho2E38ca3EZG4zvYp3hUivZ").then((res) => {
//     res.json().then((d) => {
//         console.log(d)
//     })
// })

import { Transit, RealTransaction } from "./interface";

export class Network {
    async getAccountInfo(hash: string, callback: (resp: Transit) => void = () => {}){
        await fetch(`https://apilist.tronscanapi.com/api/accountv2?address=${hash}`, {
            method: "GET"
        }).then(async (resp) => {
            const _ = await resp.json();
            const {
                transactions_out,
                transactions_in,
                balance,
                totalTransactionCount,
                name,
                withPriceTokens,
                address,
                date_created,
                activated,
            } = _;
            callback({
                transactions_out: transactions_out,
                transactions_in: transactions_in,
                balance: balance,
                totalTransactionCount: totalTransactionCount,
                name: name,
                withPriceTokens: withPriceTokens,
                address: address,
                date_created: date_created,
                activated: activated
            });
        })
    }

    async getTransactionInfo(hash: string, callback: (resp: RealTransaction) => void = () => {}){
        await fetch(`https://apilist.tronscanapi.com/api/transaction-info?hash=${hash}`, {
            method: "GET"
        }).then(async (resp) => {
            const _ = await resp.json();
            const {
                contract_map,
                contractType,
                confirmed,
                toAddress,
                ownerAddress,
                block,
                riskTransaction,
                timestamp,
            } = _;

            const urlHash = `https://tronscan.org/#/transaction/${hash}`;
            const balance = _['contractData']['balance'];
            const resourceValue = _['contractData']['resourceValue'];

            callback({
                contracts: contract_map !== undefined ? Object.keys(contract_map) : [],
                contractType: contractType,
                confirmed: confirmed,
                toAddress: toAddress,
                ownerAddress: ownerAddress,
                block: block,
                riskTransaction: riskTransaction,
                resourceValue: resourceValue,
                timestamp: timestamp,
                urlHash: urlHash,
                balance: balance
            });
        })
    }

}