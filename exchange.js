var contract;
var tokenName = "Mummy3D";
BigNumber.config({ EXPONENTIAL_AT: 50 });
BigNumber.config({ ERRORS: false });
myStorage = window.localStorage;
var referral = myStorage.getItem("masternode");
var xprov = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR";
var USD; $.getJSON(xprov, function (data) {
    USD = data.USD;
});
var installMetamask = "You are not signed into MetaMask. Please install/sign in, and try again.";
var totalTokens = new BigNumber(0e18);
var buyPrice = new BigNumber(1e18);
var sellPrice = new BigNumber(1e18);

// Start
function startApp(contractInstance, contractAddress) {
    //
    console.log(tokenName + " contract started...");
    contract = contractInstance;
    // Events audio
    var audio = new Audio('./assets/sounds/slow-spring-board.mp3');
    var tombOpen = new Audio('./assets/sounds/tomb-opening.mp3');
    var tombClose = new Audio('./assets/sounds/tomb-closing.mp3');
    var noti;

    // Listen to events
    if (typeof web3 === "undefined") {
        alertify.alert(installMetamask);
    } else {
        web3.eth.getAccounts(function (err, accounts) {
            if (err != null) {
                alertify.alert("An error occurred: " + err);
                console.error(err)
            }
            else if (accounts.length == 0) {
                alertify.alert(installMetamask);
                console.log(installMetamask);
            } else {
                var onTokenPurchase = contract.onTokenPurchase({}, 'latest');
                onTokenPurchase.watch(function (err, res) {
                    if (err != null) console.error(err);
                    else {
                        audio.play();
                        noti = "Someone bought " + BigNumber(res.args.incomingEthereum).div(1e18).toFixed(6) + " ETH worth of " + tokenName + " tokens";
                        if (res.args.customerAddress == accounts[0])
                            noti = "You bought " + BigNumber(res.args.incomingEthereum).div(1e18).toFixed(6) + " ETH worth of " + tokenName + " tokens sucessfully!";
                        //
                        //alertify.notify(noti, 'event', 5);
                        iziToast.success({
                            //title: 'Event',
                            message: noti
                        });
                        console.log(noti);
                    }
                });
                var onTokenSell = contract.onTokenSell({}, 'latest');
                onTokenSell.watch(function (err, res) {
                    if (err != null) console.error(err);
                    else {
                        audio.play();
                        noti = "Someone earned " + BigNumber(res.args.ethereumEarned).div(1e18).toFixed(6) + " ETH by selling " + tokenName + " tokens";
                        if (res.args.customerAddress == accounts[0])
                            noti = "You earned " + BigNumber(res.args.ethereumEarned).div(1e18).toFixed(6) + " ETH by selling " + tokenName + " tokens sucessfully!";
                        //
                        //alertify.notify(noti, 'event', 5);
                        iziToast.success({
                            message: noti
                        });
                        console.log(noti);
                    }
                });
                var onReinvestment = contract.onReinvestment({}, "latest");
                onReinvestment.watch(function (err, res) {
                    if (err != null) console.error(err);
                    else {
                        audio.play();
                        noti = "Someone reinvested " + BigNumber(res.args.ethereumReinvested).div(1e18).toFixed(6) + " ETH in " + tokenName + " tokens";
                        if (res.args.customerAddress == accounts[0])
                            noti = "You reinvested " + BigNumber(res.args.ethereumReinvested).div(1e18).toFixed(6) + " ETH in " + tokenName + " tokens successfully!";
                        //
                        //alertify.notify(noti, 'event', 5);
                        iziToast.success({
                            message: noti
                        });
                        console.log(noti);
                    }
                });
                var onWithdraw = contract.onWithdraw({}, "latest");
                onWithdraw.watch(function (err, res) {
                    if (err != null) console.error(err);
                    else {
                        audio.play();
                        noti = "Someone withdrew " + BigNumber(res.args.ethereumWithdrawn).div(1e18).toFixed(6) + " ETH";
                        if (res.args.customerAddress == accounts[0])
                            noti = "You withdrew " + BigNumber(res.args.ethereumWithdrawn).div(1e18).toFixed(6) + " ETH successfully!";
                        //
                        //alertify.notify(noti, 'event', 5);
                        iziToast.success({
                            message: noti
                        });
                        console.log(noti);
                    }
                });
                var onTransfer = contract.Transfer({}, "latest");
                onTransfer.watch(function (err, res) {
                    if (err != null) console.error(err);
                    else {
                        audio.play();
                        noti = "Someone transferred " + BigNumber(res.args.tokens).div(1e18).toFixed(2) + " " + tokenName + " tokens";
                        if (res.args.from == accounts[0])
                            noti = "You transferred " + BigNumber(res.args.tokens).div(1e18).toFixed(2) + " " + tokenName + " tokens to " +
                                    res.args.to.substr(0, 7) + "..." + res.args.to.substr(res.args.to.length - 4, 4) +
                                    " successfully!";
                        if (res.args.to == accounts[0])
                            noti = "You recieved " + BigNumber(res.args.tokens).div(1e18).toFixed(2) + " " + tokenName + " tokens from " +
                                        res.args.from.substr(0, 7) + "..." + res.args.from.substr(res.args.from.length - 4, 4) +
                                        " successfully!";
                        //
                        //alertify.notify(noti, 'event', 5);
                        iziToast.success({
                            message: noti
                        });
                        console.log(noti);
                    }
                });
                var onMummyAccountWitdraw = contract.onMummyAccountWitdraw({}, "latest");
                onMummyAccountWitdraw.watch(function (err, res) {
                    if (err != null) console.error(err);
                    else {
                        if (BigNumber(res.args.ethereumWithdrawn) > 0) {
                            tombOpen.play();
                            noti = "Someone got " + BigNumber(res.args.ethereumWithdrawn).div(1e18).toFixed(6) + " ETH for free from the Mummyaccount's dividends!!!";
                            if (res.args.customerAddress == accounts[0])
                                noti = "You got " + BigNumber(res.args.ethereumWithdrawn).div(1e18).toFixed(6) + " ETH for free from the Mummyaccount's dividends!!!";
                            //alertify.success(noti, 'event', 5);
                            iziToast.success({
                                message: noti
                            });
                            console.log(noti);
                        } else
                            if (res.args.customerAddress == accounts[0]) {
                                tombClose.play();
                                noti = "There are no dividends in the Mummyaccount at the moment. Try again later...";
                                //alertify.error(noti, 'event', 5);
                                iziToast.error({
                                    message: noti
                                });
                                console.log(noti);
                            }
                    }
                });
            }
        });
    }

    // Refresh infos every 2 secs
    setInterval(function () {
        web3.eth.getAccounts(function (err, accounts) {
            if (err != null) {
                console.error(err);
            } else if (accounts.length == 0) {
                console.log("No accounts");
            } else {
                var resp = contract.totalEthereumBalance(function (err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        $("#ethInContract").html(BigNumber(res).div(1e18).toFixed(6) + " ETH");
                        $("#ethInContractUSD").html("<nobr>(&nbsp;" + BigNumber(res * USD).div(1e18).toFixed(2) + " USDT&nbsp;)</nobr>");
                    }
                });
                var resp = contract.buyPrice(function (err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        $("#buyPrice").html(BigNumber(res).div(1e18).toFixed(6) + " ETH");
                        $("#buyPriceUSD").html("<nobr>(&nbsp;" + BigNumber(res * USD).div(1e18).toFixed(2) + " USDT&nbsp;)</nobr>");
                        buyPrice = BigNumber(res).div(1e18).toFixed(6)
                    }
                });
                // Depending on sell price
                var resp = contract.sellPrice(function (err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        $("#sellPrice").html(BigNumber(res).div(1e18).toFixed(6) + " ETH");
                        $("#sellPriceUSD").html("<nobr>(&nbsp;" + BigNumber(res * USD).div(1e18).toFixed(2) + " USDT&nbsp;)</nobr>");
                        sellPrice = BigNumber(res).div(1e18).toFixed(6);
                        var resp = contract.totalSupply(function (err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                $("#tokensInCirculation").html(BigNumber(res).div(1e18).toFixed(2) + "");
                                $("#tokensInCirculationUSD").html("<nobr>(&nbsp;" + BigNumber(res * sellPrice * USD).div(1e18).toFixed(2) + " USDT&nbsp;)</nobr>");
                            }
                        });
                        var resp = contract.balanceOf(accounts[0], function (err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                var resp = contract.calculateEthereumReceived(res, function (err, eth) {
                                    if (!err) {
                                        $("#totalEth").html(BigNumber(eth).div(1e18).toFixed(6) + " ETH");
                                        $("#totalEthUSD").html("(&nbsp;" + BigNumber(eth * USD).div(1e18).toFixed(2) + " USDT&nbsp;)");
                                    }
                                });

                                $("#totalTokens").html(Math.floor(BigNumber(res).div(1e16)) / 100);
                                $("#totalTokensUSD").html("(&nbsp;" + BigNumber(res * sellPrice * USD).div(1e18).toFixed(2) + " USDT&nbsp;)");

                                totalTokens = BigNumber(res);
                                
                                var resp = contract.stakingRequirement.call(function (err, stake) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        $("#stake").html(" " + BigNumber(stake).div(1e18) + " ");

                                        if (Number(totalTokens) >= Number(stake)) {
                                            //$("#blue").removeClass('hidden');
                                            $("#MNlink").attr("href", "/?masternode=" + accounts[0]);
                                            $("#MNlink").text("https://mummy3D.io/?masternode=" + accounts[0]);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
                // Totals             
                var totalDividends = new BigNumber(0e18);
                var customerDivids = new BigNumber(0e18);
                var MNodedividends = new BigNumber(0e18);
                var resp = contract.myDividends(true, function (err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        $("#totalDividends").html(BigNumber(res).div(1e18).toFixed(6) + " ETH&nbsp;");
                        $("#totalDividendsUSD").html("(&nbsp;" + BigNumber(res * USD).div(1e18).toFixed(2) + " USDT&nbsp;)");
                        totalDividends = BigNumber(res);
                        var resp = contract.myDividends(false, function (err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                $("#NMNdividends").html(BigNumber(res).div(1e18).toFixed(6) + " ETH&nbsp;");
                                $("#NMNdividendsUSD").html("(&nbsp;" + BigNumber(res * USD).div(1e18).toFixed(2) + " USDT&nbsp;)");
                                customerDivids = BigNumber(res);
                                MNodedividends = totalDividends - customerDivids;
                                $("#MNdividends").html(BigNumber(MNodedividends).div(1e18).toFixed(6) + " ETH&nbsp;");
                                $("#MNdividendsUSD").html("(&nbsp;" + BigNumber(MNodedividends * USD).div(1e18).toFixed(2) + " USDT&nbsp;)");
                            }
                        });
                    }
                });
            }
        });
    }, 2000);

    // Buy tokens
    var buyApprox;
    $("#buyTokens").keypress(function (e) {
        var buyQty = $("#buyTokens").val();
        var key = e.keyCode || e.which;
        if ((key >= 48 && key <= 57) || key == 8 || key == 46) {
            var input = buyQty + String.fromCharCode(key);
            if (input > 0 && key != 46)                
                var resp = contract.checkState(function (err, state) {                    
                    if (!err)
                        if (!state)
                            //alertify.error("Only ambassadors can buy at the moment. Try again later...")
                            iziToast.error({
                                message: 'Only ambassadors can buy at the moment. Try again later...'
                            });
                        else                
                            var resp = contract.limits(function (err, lim) {
                                if (!err)
                                    if (Number(input) > BigNumber(lim).div(1e18)) {
                                        $("#buyApprox").html("You cannot buy more than " + BigNumber(lim).div(1e18) + " ETH...");
                                        //alertify.error("You cannot buy more than " + BigNumber(lim).div(1e18) + " ETH...");
                                        iziToast.error({
                                            message: 'You cannot buy more than ' + BigNumber(lim).div(1e18) + ' ETH...'
                                        });
                                    }
                                    else
                                        var resp = contract.calculateTokensReceived(input * 1e18, function (err, res) {
                                            if (!err) {
                                                $("#buyApprox").html("Approximately " + BigNumber(res).div(1e18).toFixed(2) + " Tokens...");
                                            }
                                        });
                            });
                });
            else
                if (key != 8 && key != 46)
                    $("#buyApprox").html("Type in a number...");
        }
        else e.preventDefault();
    });
    $("#buyTokens").keydown(function (e) {
        var buyQty = $("#buyTokens").val();
        var key = e.keyCode || e.which
        if (key == 8 || key == 46) {
            if (buyQty.length == 1 || Number(buyQty) == 0)
                $("#buyApprox").html("Type in a number...");
            else
                var resp = contract.checkState(function (err, state) {
                    if (!err)
                        if (!state)
                            //alertify.error("Only ambassadors can buy at the moment. Try again later...")
                            iziToast.error({
                                message: 'Only ambassadors can buy at the moment. Try again later...'
                            });
                        else
                            var resp = contract.limits(function (err, lim) {
                                var input = buyQty.substr(0, buyQty.length - 1);
                                if (!err)
                                    if (Number(input) > BigNumber(lim).div(1e18)) {
                                        $("#buyApprox").html("You cannot buy more than " + BigNumber(lim).div(1e18) + " ETH...");
                                        //alertify.error("You cannot buy more than " + BigNumber(lim).div(1e18) + " ETH...");
                                        iziToast.error({
                                            message: 'You cannot buy more than ' + BigNumber(lim).div(1e18) + ' ETH...'
                                        });
                                    }
                                    else
                                        var resp = contract.calculateTokensReceived(input * 1e18, function (err, res) {
                                            if (!err) {
                                                $("#buyApprox").html("Approximately " + BigNumber(res).div(1e18).toFixed(2) + " Tokens...");
                                            }
                                        });
                            });
                });
        }
    });
    $("#buttBuy").click(function (e) {
        var buyQty = $("#buyTokens").val();
        var okQty = buyQty != "" && buyQty > 0;
        if (!okQty) {
            //alertify.error('Invalid quantity, try again...');
            iziToast.error({
                message: 'Invalid quantity, try again...'
            });
            $("#buyApprox").html("Type in a number...");
            $("#buyTokens").val("");
            $("#buyTokens").focus();
            e.preventDefault();
            return;
        }
        if (typeof web3 === "undefined") {
            alertify.alert(installMetamask);
        } else {
            web3.eth.getAccounts(function (err, accounts) {
                if (err != null) {
                    alertify.alert("An error occurred: " + err);
                    console.error(err)
                }
                else if (accounts.length == 0) {
                    alertify.alert(installMetamask);
                    console.log(installMetamask);
                } else {
                    var resp = contract.checkState(function (err, state) {
                        if (!err)
                            if (!state)
                                //alertify.error("Only ambassadors can buy at the moment. Try again later...")
                                iziToast.error({
                                    message: 'Only ambassadors can buy at the moment. Try again later...'
                                });
                            else
                                var resp = contract.limits(function (err, lim) {
                                    if (!err)
                                        if (Number(buyQty) > BigNumber(lim).div(1e18)) {
                                            $("#buyApprox").html("You cannot buy more than " + BigNumber(lim).div(1e18) + " ETH...");                                            
                                            //alertify.error("You cannot buy more than " + BigNumber(lim).div(1e18) + " ETH...");
                                            iziToast.error({
                                                message: 'You cannot buy more than ' + BigNumber(lim).div(1e18) + ' ETH...'
                                            });
                                        } else {
                                            //alertify.success('Quantity accepted!');
                                            iziToast.success({
                                                message: 'Quantity accepted!'
                                            });
                                            var resp = contract.buy(referral, { from: accounts[0], value: web3.toWei(buyQty), gasPrice: 2e9 }, function (err, res) {
                                                if (err) {
                                                    //alertify.error("The transaction was cancelled by the user");
                                                    iziToast.error({
                                                        message: 'The transaction was cancelled by the user'
                                                    });
                                                } else {
                                                    //alertify.success("The transaction is being processed...");
                                                    iziToast.success({
                                                        message: 'The transaction is being processed...'
                                                    });
                                                }
                                            });
                                        }
                                });
                    });
                };
            });
        }
    });

    // Sell tokens
    var sellApprox;
    function validateSell(sellQty) {
        if (Number(sellQty) > 0) {
            var okTokens = Number(sellQty) <= (totalTokens / 1e18);
            if (!okTokens) {
                //alertify.error("You don't have this many tokens...");
                iziToast.error({
                    message: "You don't have this many tokens..."
                });
                $("#sellApprox").html("You don't have this many tokens...");
                $("#sellTokens").focus();
            }
            return okTokens;        
        } else {
            //alertify.error('Invalid quantity, try again...');
            iziToast.error({
                message: "Invalid quantity, try again..."
            });
            $("#sellApprox").html("Type in a number...");
            $("#sellTokens").val("");
            $("#sellTokens").focus();
            return false;
        }        
    }
    $("#sellTokens").keypress(function (e) {
        var sellQty = $("#sellTokens").val();
        var key = e.keyCode || e.which;
        if ((key >= 48 && key <= 57) || key == 8 || key == 46) {
            var input = sellQty + String.fromCharCode(key);
            if (key != 46 && validateSell(input))
                var resp = contract.checkState(function (err, state) {
                    if (!err)
                        if (!state)
                            //alertify.error("Ambassadors can't sell at the moment. Try again later...<br>(Mummy account can never sell)")
                            iziToast.error({
                                message: "Ambassadors can't sell at the moment. Try again later...<br>(Mummy account can never sell)"
                            });
                        else
                            var resp = contract.calculateEthereumReceived(input * 1e18, function (err, eth) {
                                if (!err) {
                                    var resp = contract.limits(function (err, lim) {
                                        if (!err) {
                                            if (false && BigNumber(eth).div(1e18) > BigNumber(lim).div(1e18)) { // Bypass
                                                //$("#sellApprox").html("You cannot sell more than " + BigNumber(lim).div(1e18) + " ETH...");
                                                //alertify.error("You cannot sell more than " + BigNumber(lim).div(1e18) + " ETH...");
                                                iziToast.error({
                                                    message: "You cannot sell more than " + BigNumber(lim).div(1e18) + " ETH..."
                                                });
                                            }
                                            //else
                                            $("#sellApprox").html("Approximately " + BigNumber(eth).div(1e18).toFixed(6) + " ETH...");
                                        }
                                    });
                                }
                            });
                });
        }
        else e.preventDefault();
    });
    $("#sellTokens").keydown(function (e) {
        var sellQty = $("#sellTokens").val();
        var key = e.keyCode || e.which
        if (key == 8 || key == 46) {
            var resp = contract.checkState(function (err, state) {
                if (!err)
                    if (!state)
                        //alertify.error("Ambassadors can't sell at the moment. Try again later...<br>(Mummy account can never sell)")
                        iziToast.error({
                            message: "Ambassadors can't sell at the moment. Try again later...<br>(Mummy account can never sell)"
                        });
                    else
                        if (sellQty.length == 1 || Number(sellQty) == 0)
                            $("#sellApprox").html("Type in a number...");
                        else {
                            var input = sellQty.substr(0, sellQty.length - 1)
                            if (validateSell(input))
                                var resp = contract.calculateEthereumReceived(input * 1e18, function (err, eth) {
                                    if (!err) {
                                        var resp = contract.limits(function (err, lim) {
                                            if (!err) {
                                                if (false && BigNumber(eth).div(1e18) > BigNumber(lim).div(1e18)) { // Bypass
                                                    //$("#sellApprox").html("You cannot sell more than " + BigNumber(lim).div(1e18) + " ETH...");
                                                    //alertify.error("You cannot sell more than " + BigNumber(lim).div(1e18) + " ETH...");
                                                    iziToast.error({
                                                        message: "You cannot sell more than " + BigNumber(lim).div(1e18) + " ETH..."
                                                    });
                                                }
                                                //else
                                                $("#sellApprox").html("Approximately " + BigNumber(eth).div(1e18).toFixed(6) + " ETH...");
                                            }
                                        });
                                    }
                                });
                        }
            });
        }
    });
    $("#buttSell").click(function (e) {
        var sellQty = $("#sellTokens").val();
        if (validateSell(sellQty)) {
            if (typeof web3 === "undefined") {
                alertify.alert(installMetamask);
            } else {
                web3.eth.getAccounts(function (err, accounts) {
                    if (err != null) {
                        alertify.alert("An error occurred: " + err);
                        console.error(err)
                    }
                    else if (accounts.length == 0) {
                        alertify.alert(installMetamask);
                        console.log(installMetamask);
                    } else {
                        var resp = contract.checkState(function (err, state) {
                            if (!err)
                                if (!state)
                                    //alertify.error("Ambassadors can't sell at the moment. Try again later...<br>(Mummy account can never sell)")
                                    iziToast.error({
                                        message: "Ambassadors can't sell at the moment. Try again later...<br>(Mummy account can never sell)"
                                    });
                                else
                                    var resp = contract.calculateEthereumReceived(sellQty * 1e18, function (err, eth) {
                                        if (!err) {
                                            var resp = contract.limits(function (err, lim) {
                                                if (!err) {
                                                    if (false && BigNumber(eth).div(1e18) > BigNumber(lim).div(1e18)) { // Bypass                                                        
                                                        //alertify.error("You cannot sell more than " + BigNumber(lim).div(1e18) + " ETH...");
                                                        iziToast.error({
                                                            message: "You cannot sell more than " + BigNumber(lim).div(1e18) + " ETH..."
                                                        });
                                                    } else {
                                                        //alertify.success('Quantity accepted!');
                                                        iziToast.success({
                                                            message: "Quantity accepted!"
                                                        });
                                                        var input = web3.toBigNumber(sellQty * 1e18);
                                                        var resp = contract.sell(input, { gasPrice: 2e9 }, function (err, res) {
                                                            if (err) {
                                                                //alertify.error("The transaction was cancelled by the user");
                                                                iziToast.error({
                                                                    message: "The transaction was cancelled by the user"
                                                                });
                                                            } else {
                                                                //alertify.success("The transaction is being processed...");
                                                                iziToast.success({
                                                                    message: "The transaction is being processed..."
                                                                });
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    });
                        });
                    }
                });
            }
        }
    });

    // Transfer tokens
    var transApprox;
    function isChecksumAddress(address) {
        // Check each case
        address = address.replace('0x', '');
        var addressHash = sha3(address.toLowerCase());
        for (var i = 0; i < 40; i++) {
            // the nth letter should be uppercase if the nth digit of casemap is 1
            if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
                return false;
            }
        }
        return true;
    };            
    function isAddress(address) {
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
            // check if it has the basic requirements of an address
            return false;
        } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
            // If it's all small caps or all all caps, return true
            return true;
        } else {
            // Otherwise check each case
            return isChecksumAddress(address);
        }
    };
    $("#address").on("focusout", function() {
        if (!isAddress($("#address").val())) {
            $("#valiTransfer").html("Enter a valid address...");
            //alertify.error("Enter a valid address...");
            iziToast.error({
                message: "Enter a valid address..."
            });
            $("#address").val("");
            return false;
        }
    });
    //
    function valiTransfer(transferQty) {
        if ($("#address").val() == "") {
            //alertify.error("Enter a valid address...");
            iziToast.error({
                message: "Enter a valid address..."
            });
            $("#valiTransfer").html("Enter a valid address...");
            $("#address").focus();
            return false;
        } else {
            if (Number(transferQty) > 0) {
                var okTokens = Number(transferQty) <= (totalTokens / 1e18);
                if (!okTokens) {
                    //alertify.error("You don't have this many tokens...");
                    iziToast.error({
                        message: "You don't have this many tokens..."
                    });
                    $("#valiTransfer").html("You don't have this many tokens...");
                    $("#transfer").focus();
                }
                return okTokens;
            } else {
                //alertify.error('Invalid quantity, try again...');
                iziToast.error({
                    message: "Invalid quantity, try again..."
                });
                $("#valiTransfer").html("Type in a number...");
                $("#transfer").focus();
                return false;
            }
        }
    }
    $("#transfer").keypress(function (e) {
        var transferQty = $("#transfer").val();
        var key = e.keyCode || e.which;
        if ((key >= 48 && key <= 57) || key == 8 || key == 46) {
            var resp = contract.checkState(function (err, state) {
                if (!err)
                    if (!state)
                        //alertify.error("Ambassadors can't transfer at the moment. Try again later...<br>(Mummy account can never transfer)")
                        iziToast.error({
                            message: "Ambassadors can't transfer at the moment. Try again later...<br>(Mummy account can never transfer)"
                        });
                    else
                        if (valiTransfer(transferQty + String.fromCharCode(key)))
                            var resp = contract.calculateEthereumReceived((transferQty + String.fromCharCode(key)) * 1e18, function (err, res) {
                                if (!err) {
                                    $("#valiTransfer").html("Approximately " + BigNumber(res).div(1e18).toFixed(6) + " ETH...");
                                }
                            });
            });
        }
        else e.preventDefault();
    });
    $("#transfer").keydown(function (e) {
        var transferQty = $("#transfer").val();
        var key = e.keyCode || e.which
        if (key == 8 || key == 46) {
            var resp = contract.checkState(function (err, state) {
                if (!err)
                    if (!state)
                        //alertify.error("Ambassadors can't transfer at the moment. Try again later...<br>(Mummy account can never transfer)")
                        iziToast.error({
                            message: "Ambassadors can't transfer at the moment. Try again later...<br>(Mummy account can never transfer)"
                        });
                    else
                        if (transferQty.length == 1 || Number(transferQty) == 0)
                            $("#valiTransfer").html("Type in a number...");
                        else
                            if (valiTransfer(transferQty.substr(0, transferQty.length - 1)))
                                var resp = contract.calculateEthereumReceived(transferQty.substr(0, transferQty.length - 1) * 1e18, function (err, res) {
                                    if (!err) {
                                        $("#valiTransfer").html("Approximately " + BigNumber(res).div(1e18).toFixed(6) + " ETH...");
                                    }
                                });
            });
        }
    });
    $("#buttTransfer").click(function (e) {
        var transferQty = $("#transfer").val();
        if (valiTransfer(transferQty)) {
            //alertify.success('Quantity accepted!');
            iziToast.success({
                message: "Quantity accepted!"
            });
            if (typeof web3 === "undefined") {
                alertify.alert(installMetamask);
            } else {
                web3.eth.getAccounts(function (err, accounts) {
                    if (err != null) {
                        alertify.alert("An error occurred: " + err);
                        console.error(err)
                    }
                    else if (accounts.length == 0) {
                        alertify.alert(installMetamask);
                        console.log(installMetamask);
                    }
                    else
                        var resp = contract.checkState(function (err, state) {
                            if (!err)
                                if (!state)
                                    //alertify.error("Ambassadors can't transfer at the moment. Try again later...<br>(Mummy account can never transfer)")
                                    iziToast.error({
                                        message: "Ambassadors can't transfer at the moment. Try again later...<br>(Mummy account can never transfer)"
                                    });
                                else {
                                    var input = web3.toBigNumber(transferQty * 1e18);
                                    var resp = contract.transfer($("#address").val(), input, { gasPrice: 2e9 }, function (err, res) {
                                        if (err) {
                                            //alertify.error("The transaction was cancelled by the user");
                                            iziToast.error({
                                                message: "The transaction was cancelled by the user"
                                            });
                                        } else {
                                            //alertify.success("The transaction is being processed...");
                                            iziToast.success({
                                                message: "The transaction is being processed..."
                                            });
                                        }
                                    });
                                };
                        });
                });
            }
        }
    });

    // Reinvest tokens
    $("#reinvest").click(function (e) {
        e.preventDefault();
        if (typeof web3 === "undefined") {
            alertify.alert(installMetamask);
        } else {
            web3.eth.getAccounts(function (err, accounts) {
                if (err != null) {
                    alertify.alert("An error occurred: " + err);
                    console.error(err)
                }
                else if (accounts.length == 0) {
                    alertify.alert(installMetamask);
                    console.log(installMetamask);
                } else {
                    var resp = contract.myDividends(true, function (err, res) {
                        if (err) console.log(err);
                        else
                            if (!(BigNumber(res) > 0)) {
                                //alertify.error("You don't have dividends yet...");
                                iziToast.error({
                                    message: "You don't have dividends yet..."
                                });
                                return;
                            } 
                            else
                                var resp = contract.checkState(function (err, state) {
                                    if (!err)
                                        if (!state)
                                            //alertify.error("Ambassadors can't reinvest at the moment. Try again later...<br>(Mummy account can never reinvest)")
                                            iziToast.error({
                                                message: "Ambassadors can't reinvest at the moment. Try again later...<br>(Mummy account can never reinvest)"
                                            });
                                        else
                                            var resp = contract.reinvest({ gasPrice: web3.toWei(2, 'gwei') }, function (err, res) {
                                                if (err) {
                                                    //alertify.error("The transaction was cancelled by the user");
                                                    iziToast.error({
                                                        message: "The transaction was cancelled by the user"
                                                    });
                                                } else {
                                                    //alertify.success("The transaction is being processed...");
                                                    iziToast.success({
                                                        message: "The transaction is being processed..."
                                                    });
                                                }
                                            });
                                });                            
                    });
                }
            });
        }
    });

    // Withdraw
    $("#withdraw").click(function (e) {
        e.preventDefault();
        if (typeof web3 === "undefined") {
            alertify.alert(installMetamask);
        } else {
            web3.eth.getAccounts(function (err, accounts) {
                if (err != null) {
                    alertify.alert("An error occurred: " + err);
                    console.error(err)
                }
                else if (accounts.length == 0) {
                    alertify.alert(installMetamask);
                    console.log(installMetamask);
                }
                else
                    var resp = contract.myDividends(true, function (err, res) {
                        if (err) console.log(err);
                        else
                            if (!(BigNumber(res) > 0)) {
                                //alertify.error("You don't have dividends yet...");
                                iziToast.error({
                                    message: "You don't have dividends yet..."
                                });
                                return;
                            }
                            else
                                var resp = contract.checkState(function (err, state) {
                                    if (!err)
                                        if (!state)
                                            //alertify.error("Ambassadors can't withdraw at the moment. Try again later...<br>(Mummy account can never withdraw)")
                                            iziToast.error({
                                                message: "Ambassadors can't withdraw at the moment. Try again later...<br>(Mummy account can never withdraw)"
                                            });
                                        else
                                            var resp = contract.withdraw({ gasPrice: 2e9 }, function (err, res) {
                                                if (err) {
                                                    //alertify.error("The transaction was cancelled by the user");
                                                    iziToast.error({
                                                        message: "The transaction was cancelled by the user"
                                                    });
                                                } else {
                                                    //alertify.success("The transaction is being processed...");
                                                    iziToast.success({
                                                        message: "The transaction is being processed..."
                                                    });
                                                }
                                            });
                                });
                    });
            });
        }
    });

    // Withdraw Tut's Gold
    $("#tutsGold").click(function (e) {
        e.preventDefault();
        if (typeof web3 === "undefined") {
            alertify.alert(installMetamask);
        } else {
            web3.eth.getAccounts(function (err, accounts) {
                if (err != null) {
                    alertify.alert("An error occurred: " + err);
                    console.error(err)
                }
                else if (accounts.length == 0) {
                    alertify.alert(installMetamask);
                    console.log(installMetamask);
                }
                else
                    var resp = contract.checkState(function (err, state) {
                        if (!err)
                            if (!state)
                                //alertify.error("Tut's gold is locked until ambassadors invest first. Try again later...")
                                iziToast.error({
                                    message: "Tut's gold is locked until ambassadors invest first. Try again later..."
                                });
                            else
                                var resp = contract.balanceOf(accounts[0], function (err, res) {
                                    if (err)
                                        console.log(err);
                                    else
                                        if (BigNumber(res) > 0)
                                            var resp = contract.MummyAccountWithdraw({ gasPrice: 2e9 }, function (err, res) {
                                                if (err) {
                                                    //alertify.error("The transaction was cancelled by the user");
                                                    iziToast.error({
                                                        message: "The transaction was cancelled by the user"
                                                    });
                                                } else {
                                                    //alertify.success("The transaction is being processed...");
                                                    iziToast.success({
                                                        message: "The transaction is being processed..."
                                                    });
                                                }
                                            });
                                        else
                                            iziToast.error({
                                                message: "You need to have some tokens to try getting the MummyAccount's dividends..."
                                            });                                            
                                });
                    });
            });
        }
    });

    // View contract
    $("#view").click(function () {
        document.location = "https://etherscan.io/address/" + contractAddress;
    });
}

