// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CustomToken is ERC20{
    constructor(string memory name, string memory symbol) ERC20(name,symbol){
        _mint(msg.sender,10000000 * 10 ** 18);
    }
}


contract CustomDex {
    string[] public tokens = ["Tether USD", "BNB", "USD Coin", "stETH","TRON","Matic Token","SHIBA INU","Uniswap"];


    mapping(string=>ERC20) public tokenInstanceMap;

    uint ethValue = 1000000000000000;

    struct History{
        uint historyId;
        string tokenA;
        string tokenB;
        uint inputValue;
        uint outputValue;
        address userAddress;
    }

    uint public _historyIndex;
    mapping(uint=>History) private history;

    constructor(){
        for(uint i=0;i<tokens.length;i++){
            CustomToken token = new CustomToken(tokens[i],tokens[i]);
            tokenInstanceMap[tokens[i]] = token;
        }
    }

    function getBalance(string memory tokenName,address _address) public view returns(uint){
        return tokenInstanceMap[tokenName].balanceOf(_address);
    }

    function getTotalSupply(string memory tokenName) public view returns(uint){
        return tokenInstanceMap[tokenName].totalSupply();
    }

    function getName(string memory tokenName) public view returns(string memory){
        return tokenInstanceMap[tokenName].name();
    }

    function getTokenAddress(string memory tokenName) public view returns(address){
        return address(tokenInstanceMap[tokenName]);
    }

    function getEthBalance() public view returns(uint){
        return address(this).balance;
    }

    function _transactionHistory(string memory tokenName, string memory etherToken,uint inputValue, uint outputValue) internal{
        _historyIndex++;
        uint _historyId = _historyIndex;
        History storage history = history[_historyId];
        history.historyId = _historyId;
        history.userAddress = msg.sender;
        history.tokenA = tokenName;
        history.tokenB = etherToken;
        history.inputValue = inputValue;
        history.outputValue = outputValue;
    }

    function swapEthToToken(string memory tokenName) public payable returns(uint){
        uint inputValue = msg.value;
        uint outputValue = (inputValue/ethValue) * 10 ** 18; //Convert to 18 decimal places
        require(tokenInstanceMap[tokenName].transfer(msg.sender,outputValue));

        string memory etherToken = "Ether";

        _transactionHistory(tokenName, etherToken, inputValue, outputValue);

        return outputValue;
    }

    function swapTokenToEth(string memory tokenName, uint _amount) public returns(uint){
        // Convert the token amount (ethValue) to exact amount (10)
        uint exactAmount = _amount/10**18;
        uint ethToBeTransfered = exactAmount * ethValue;
        require(address(this).balance>=ethToBeTransfered,"Dex is running low on balance.");
        payable(msg.sender).transfer(ethToBeTransfered);
        require(tokenInstanceMap[tokenName].transferFrom(msg.sender,address(this),_amount));

        string memory etherToken = "Ether";
        _transactionHistory(tokenName, etherToken, exactAmount, ethToBeTransfered);
        return ethToBeTransfered;
    }

    function swapTokenToToken(string memory srcTokenName, string memory destTokenName, uint _amount) public{
        require(tokenInstanceMap[srcTokenName].transferFrom(msg.sender,address(this),_amount));
        require(tokenInstanceMap[destTokenName].transfer(msg.sender,_amount));

        _transactionHistory(srcTokenName, destTokenName, _amount, _amount);
    }

    function getAllHistory() public view returns(History[] memory){
        uint itemCount = _historyIndex;
        uint currentIndex = 0;

        History[] memory items = new History[](itemCount);

        for (uint i = 0; i<itemCount;i++){
            uint currentId = i + 1;
            History storage currentItem = history[currentId];
            items[currentIndex] = currentItem;
            currentIndex+=1;

        }

        return items;
    }
}