import * as chai from 'chai'
import BlockChainService from '../src/blockchain'
const expect = chai.expect;


describe('BlockChain', () => {
  describe('createNewBlock 메소드 테스트', () => {
    it ('생성 후, chain에 하나의 블럭이 있어야 한다', done => {
      const bitcoin = new BlockChainService()
      bitcoin.createNewBlcok(2389, 'OIUOEREDHKHKD', '78s97d4x6dsf')
      expect(bitcoin.chain.length).to.equal(1);
      done()
    }) 
  })
  describe('createNewTransaction 메소드 테스트', () => {
    it ('생성 후, pendingTransactions에 하나의 기록이 있어야 한다', done => {
      const bitcoin = new BlockChainService()
      bitcoin.createNewBlcok(2389, 'OIUOEREDHKHKD', '78s97d4x6dsf')
      bitcoin.createNewTransaction(50, 'OIUOEDJETH8754DHKD', '78SHNEG45DER56')
      expect(bitcoin.chain[0].transactions.length).to.equal(0);
      expect(bitcoin.pendingTransactions.length).to.equal(1);
      done()
    }) 
    it ('미결 트랜잭션 테스트', done => {
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
  describe('hashBlock 메소드 테스트', () => {
    it ('문자열을 반환하는가?', done => {
      const bitcoin = new BlockChainService()
      const previousBlockHash = '87765DA6CCF0668238C1D27C35692E11'
      const currentBlockData = [{
        amount: 10,
        sender: 'B4CEE9C0E5CD571',
        recipient: '3A3F6E462D48E9',
      }]
      const nonce = 100
      const hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)
      expect(hash).to.be.an('string')
      done()
    }) 
  })
});