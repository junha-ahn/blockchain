import * as chai from 'chai'
import BlockChainService from '../src/loaders/blockchain'
const expect = chai.expect;


describe('BlockChain', () => {
  describe('BlockChainService 생성자 테스트', () => {
    it ('생성 후, 제네시스 블록이 존재해야 한다', done => {
      const bitcoin = new BlockChainService()
      expect(bitcoin.chain.length).to.equal(1);
      done()
    }) 
  })
  describe('createNewBlock 메소드 테스트', () => {
    it ('생성시 chain에 블럭이 추가되어 있어야 한다', done => {
      const bitcoin = new BlockChainService()
      bitcoin.createNewBlcok(2389, 'OIUOEREDHKHKD', '78s97d4x6dsf')
      expect(bitcoin.chain.length).to.equal(2);
      done()
    }) 
  })
  describe('createNewTransaction & addTransactionToPendingTransaction 메소드 테스트', () => {
    it ('생성 후, pendingTransactions에 하나의 기록이 있어야 한다', done => {
      const bitcoin = new BlockChainService()
      bitcoin.createNewBlcok(2389, 'OIUOEREDHKHKD', '78s97d4x6dsf')
      bitcoin.addTransactionToPendingTransaction(bitcoin.createNewTransaction(50, 'OIUOEDJETH8754DHKD', '78SHNEG45DER56'))
      expect(bitcoin.chain[0].transactions.length).to.equal(0);
      expect(bitcoin.pendingTransactions.length).to.equal(1);
      done()
    }) 
    it ('미결 트랜잭션 테스트', done => {
      // TODO: change test name. i cant find pertinent name
      const bitcoin = new BlockChainService()
      bitcoin.createNewBlcok(2389, 'OIUOEREDHKHKD', '78s97d4x6dsf')
      bitcoin.addTransactionToPendingTransaction(bitcoin.createNewTransaction(100, 'OIUOEDJETH8754DHKD', '78SHNEG45DER56'))
      bitcoin.createNewBlcok(548764, 'OIUOEREDHKHKD', '78s97d4x6dsf')
      
      
      bitcoin.addTransactionToPendingTransaction(bitcoin.createNewTransaction(50, 'OIUOEDJETH8754DHKD', '78SHNEG45DER56'))
      bitcoin.addTransactionToPendingTransaction(bitcoin.createNewTransaction(200, 'OIUOEDJETH8754DHKD', '78SHNEG45DER56'))
      bitcoin.addTransactionToPendingTransaction(bitcoin.createNewTransaction(300, 'OIUOEDJETH8754DHKD', '78SHNEG45DER56'))
      
      bitcoin.createNewBlcok(9878934, 'OIUOEREDHKHKD', '78s97d4x6dsf')
      
      expect(bitcoin.chain[1].transactions.length).to.equal(0);
      expect(bitcoin.chain[3].transactions.length).to.equal(3);
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
  // describe('prootOfWork 메소드 테스트', () => {
  //   it ('문자열을 반환하는가?', done => {
  //     const bitcoin = new BlockChainService()
  //     const previousBlockHash = '87765DA6CCF0668238C1D27C35692E11'
  //     const currentBlockData = [{
  //       amount: 101,
  //       sender: 'B4CEE9C0E5CD571',
  //       recipient: '3A3F6E462D48E9',
  //     }, {
  //       amount: 30,
  //       sender: 'DKDK1LKWEI197329',
  //       recipient: 'K13139DSAJLKJLSLAF',
  //     }, {
  //       amount: 200,
  //       sender: '123132KLDASSAI',
  //       recipient: 'DSAKLJ2JKL312',
  //     }]
  //     // const nonce = 205918
  //     const result = bitcoin.proofOfWerk(previousBlockHash, currentBlockData)
  //     expect(result).to.be.an('number')
  //     done()
  //   }) 
  // })
});