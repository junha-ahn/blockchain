import * as chai from 'chai'
import BlockChainService from '../src/blockchain'
const expect = chai.expect;


describe('BlockChain', () => {
  describe('createNewBlock 메소드 테스트', () => {
    it ('생성 후, chain에 하나의 블럭이 있어야 한다', (done) => {
      const bitcoin = new BlockChainService()
      bitcoin.createNewBlcok(2389, 'OIUOEREDHKHKD', '78s97d4x6dsf')
      expect(bitcoin.chain.length).to.equal(1);
      done()
    }) 
  })
  describe('createNewTransaction 메소드 테스트', () => {
    it ('생성 후, pendingTransactions에 하나의 기록이 있어야 한다', (done) => {
      const bitcoin = new BlockChainService()
      bitcoin.createNewBlcok(2389, 'OIUOEREDHKHKD', '78s97d4x6dsf')
      bitcoin.createNewTransaction(50, 'OIUOEDJETH8754DHKD', '78SHNEG45DER56')
      expect(bitcoin.chain[0].transactions.length).to.equal(0);
      expect(bitcoin.pendingTransactions.length).to.equal(1);
      done()
    }) 
    it ('미결 트랜잭션 테스트', (done) => {
      // TODO: change test name. i cant find pertinent name
      const bitcoin = new BlockChainService()
      bitcoin.createNewBlcok(2389, 'OIUOEREDHKHKD', '78s97d4x6dsf')
      bitcoin.createNewTransaction(100, 'OIUOEDJETH8754DHKD', '78SHNEG45DER56')
      bitcoin.createNewBlcok(548764, 'OIUOEREDHKHKD', '78s97d4x6dsf')
      
      
      bitcoin.createNewTransaction(50, 'OIUOEDJETH8754DHKD', '78SHNEG45DER56')
      bitcoin.createNewTransaction(200, 'OIUOEDJETH8754DHKD', '78SHNEG45DER56')
      bitcoin.createNewTransaction(300, 'OIUOEDJETH8754DHKD', '78SHNEG45DER56')
      
      bitcoin.createNewBlcok(9878934, 'OIUOEREDHKHKD', '78s97d4x6dsf')
      
      expect(bitcoin.chain[0].transactions.length).to.equal(0);
      expect(bitcoin.chain[2].transactions.length).to.equal(3);
      expect(bitcoin.pendingTransactions.length).to.equal(0);
      done()
    }) 
  })
});