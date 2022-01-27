const NFT = artifacts.require("./NFT.sol")
const truffleAssert = require('truffle-assertions');

contract("NFT Contract", (accounts) => {
  it("allow Person to buy 1 NFT", async () => {
    let contract_owner = accounts[0];
    let buyer = accounts[8];
    const nft = await NFT.deployed();

    let starting_balance = await web3.eth.getBalance(contract_owner);
    starting_balance = parseFloat(web3.utils.fromWei(starting_balance, 'ether'))

    await nft.purchase(1, {
      from: buyer,
      value: web3.utils.toWei('0.05', 'ether')
    })
    
    owner = await nft.ownerOf(1)
    assert.equal(owner, buyer)

    token_URI = await nft.tokenURI(1)
    assert.equal(token_URI, "https://www.meine-domain.de/nfts/1")

    let ending_balance = await web3.eth.getBalance(contract_owner);
    ending_balance = parseFloat(web3.utils.fromWei(ending_balance, 'ether'))
    
    assert.isAbove(ending_balance, starting_balance + 0.049999)
    assert.isBelow(ending_balance, starting_balance + 0.051111)
  });

  it("allow Person to buy several NFTs", async () => {
    let contract_owner = accounts[0];
    let buyer = accounts[7];
    const nft = await NFT.deployed();

    let starting_balance = await web3.eth.getBalance(contract_owner);
    starting_balance = parseFloat(web3.utils.fromWei(starting_balance, 'ether'))

    await nft.purchase(4, {
      from: buyer,
      value: web3.utils.toWei('0.2', 'ether')
    })
    
    balance = parseInt(await nft.balanceOf(buyer))
    assert.equal(balance, 4)

    let ending_balance = await web3.eth.getBalance(contract_owner);
    ending_balance = parseFloat(web3.utils.fromWei(ending_balance, 'ether'))
    
    assert.isAbove(ending_balance, starting_balance + 0.19)
    assert.isBelow(ending_balance, starting_balance + 0.21)
  });

  it("doesn't allow more than the max quantity", async () => {
    let contract_owner = accounts[0];
    let buyer = accounts[7];
    const nft = await NFT.deployed();

    let starting_balance = await web3.eth.getBalance(contract_owner);
    starting_balance = parseFloat(web3.utils.fromWei(starting_balance, 'ether'))

    await truffleAssert.reverts(nft.purchase(11, {
      from: buyer,
      value: web3.utils.toWei('0.55', 'ether')
    }), "Can't mint more than 10")
  })

  it("max quantity exceeded", async () => {
    const nft = await NFT.new("https://www.meine-domain.de/nfts/")
    let contract_owner = accounts[0];
    let buyer = accounts[7];

    let starting_balance = await web3.eth.getBalance(contract_owner);
    starting_balance = parseFloat(web3.utils.fromWei(starting_balance, 'ether'))

    await nft.purchase(2, {
      from: buyer,
      value: web3.utils.toWei('0.10', 'ether')
    })

    await nft.purchase(7, {
      from: buyer,
      value: web3.utils.toWei('0.35', 'ether')
    })

    await nft.purchase(5, {
      from: buyer,
      value: web3.utils.toWei('0.25', 'ether')
    })

    await nft.purchase(6, {
      from: buyer,
      value: web3.utils.toWei('0.30', 'ether')
    })

    await truffleAssert.reverts(nft.purchase(1, {
      from: buyer,
      value: web3.utils.toWei('0.05', 'ether')
    }), "Project is finished minting")
  })

  it("requires correct amount of money", async () => {
    let contract_owner = accounts[0];
    let buyer = accounts[8];
    const nft = await NFT.deployed();

    let starting_balance = await web3.eth.getBalance(contract_owner);
    starting_balance = parseFloat(web3.utils.fromWei(starting_balance, 'ether'))

    await truffleAssert.reverts(nft.purchase(1, {
      from: buyer,
      value: web3.utils.toWei('0.02', 'ether')
    }), "not enough eth send")
  })

  it("allow owner to change base URI", async () => {
    let buyer = accounts[8];
    const nft = await NFT.deployed();

    await nft.purchase(1, {
      from: buyer,
      value: web3.utils.toWei('0.05', 'ether')
    })
    
    owner = await nft.ownerOf(1)
    assert.equal(owner, buyer)

    token_URI = await nft.tokenURI(1)
    assert.equal(token_URI, "https://www.meine-domain.de/nfts/1")
    
    await nft.setBaseURI("https://www.meine-andere-domain.de/nfts/");
    
    token_URI = await nft.tokenURI(1)
    assert.equal(token_URI, "https://www.meine-andere-domain.de/nfts/1")
  })

})