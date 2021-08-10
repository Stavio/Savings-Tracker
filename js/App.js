

const StorageController = (function () {

    return {
        storeAsset: function (asset) {
            let assets = [];

            if (localStorage.getItem('assets') === null) {
                assets = [];
                assets.push(asset);

                localStorage.setItem('assets', JSON.stringify(assets));
            } else {
                assets = JSON.parse(localStorage.getItem('assets'));

                assets.push(asset);

                localStorage.setItem('assets', JSON.stringify(assets));
            }


        },

        getAssetFromStorage: function () {
            let assets;
            if (localStorage.getItem('assets') === null) {
                assets = [];
            } else {
                assets = JSON.parse(localStorage.getItem('assets'));

            }
            return assets;
        },

        deleteAssetFromStorage: function (storageId) {
            let assets = JSON.parse(localStorage.getItem('assets'));

            assets.forEach(function (asset, index) {
                if (storageId == asset.id) {
                    assets.splice(index, 1);
                }

                localStorage.setItem('assets', JSON.stringify(assets));
            });


        },

        updateAsset: function (id) {
            let data = window.localStorage.getItem('assets');
            if (data != null) {
                let goalAsset = JSON.parse(data);
                if (goalAsset[id].goalStatus) {
                    goalAsset[id].goalStatus = false;
                } else {
                    goalAsset[id].goalStatus = true;
                }
                window.localStorage.setItem('assets', JSON.stringify(goalAsset));

            }
        }
    }


})();



// Asset -- Controller
const AssetController = (function () {

    const nowDate = new Date();

    const Asset = function (id, title, description, totalGoal, targetStartDate, targetEndDate, goalStatus, obj) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.totalGoal = totalGoal;
        this.targetStartDate = targetStartDate;
        this.targetEndDate = targetEndDate;
        this.goalStatus = goalStatus;
        this.obj = obj;
    }

    //data structure / state
    const data = {
        Asset: StorageController.getAssetFromStorage(),
        totalSaves: 0,
        totalRemains: 0,
        sumOfAssets: 0,
        savesPrices: []

    }

    // public methods
    return {
        getAssets: function () {
            return data.Asset;
        },


        logData: function () {
            return data;
        },

        getAssetDeposit: function () {
            return data.savesPrices;
        },

        getTotalSaves: function () {
            let total = 0;
            const getAssets = this.getAssets();
            if (getAssets != null) {
                getAssets.forEach(function (asset) {
                    total += asset.obj;
                })

                data.totalSaves = total;
            }

            return data.totalSaves;
        },


        // sum of all the assets
        getAssetSum: function () {
            let total = 0;
            const getAssets = this.getAssets();

            if (getAssets != null) {
                getAssets.forEach(function (asset) {
                    total += asset.totalGoal;
                })

                data.sumOfAssets = total;
            }


            return data.sumOfAssets;
        },

        // remains 
        displayRemains: function () {
            const assetTotal = this.getAssetSum();
            const saves = this.getTotalSaves();

            const remains = assetTotal - saves;
            return remains
        },

        // assets-ID 
        add_Asset: function (title, description, amount, startDate, endDate) {
            // logic here
            let ID;
            const itemStore = AssetController.getAssetDeposit();
            const assetData = AssetController.getAssets();
            let goalStatus = false;


            if (assetData !== null && assetData.length > 0) {
                ID = assetData[assetData.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // convert amount to number
            amount = parseFloat(amount);
            newAsset = new Asset(ID, title, description, amount, startDate, endDate, goalStatus, itemStore);

            if (assetData !== null) {
                assetData.push(newAsset);
                StorageController.storeAsset(newAsset);
            }


            return newAsset;
        },

        //push amount into assets saves-price object based on id selected
        depositAmountById: function (assetId, assetItem) {
            const assetData = this.getAssets();

            assetData.forEach(function (item) {
                if (item.id == assetId) {
                    item.obj.push(assetItem);
                    console.log(item)
                    StorageController.storeAsset(item);
                }


            })



        },



    }

})();


// UI -- Controller 
const UIController = (function () {

    ///date picker
    let today = new Date();
    let picker = tui.DatePicker.createRangePicker({
        startpicker: {
            date: today,
            input: '#startpicker-input',
            container: '#startpicker-container'
        },
        endpicker: {
            date: today,
            input: '#endpicker-input',
            container: '#endpicker-container'
        },
        selectableRanges: [
            [today, new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())]
        ]
    });


    const UIselectors = {
        assetList: "#asset-list",
        assetSum: "#sumOfTarget",
        assetRemain: "#cashRemain",
        totalSaved: "#totalSaved",
        addAsset: "#addAsset",
        assetName: "#asset-name",
        assetDesc: "#description-text",
        assetAmount: "#Invest_Amount",
        assetDate: "#target-date",
        deleteIcon: "#asset_delete",
        depositBtn: "#assetDeposit",
        depositAmount: "#depositAmount",
        assetType: "#assetType",
        depositDate: "#depositDate",

    }

    //public methods
    return {

        getSelectors: function () {
            return UIselectors;
        },

        showAllAssets: function (assets) {

            let html = '';
            if (assets != null) {

                assets.forEach(function (asset) {

                    if (asset.savesPrices !== null) {

                        if (asset.goalStatus) {
                            html += `
                    <div class="col col-sm-4 col-xs-6 asset-card" id="${asset.id}">
                    <div class="card">
                        <div class="card-header">
                        
                            <h2 class="completeBox">Goal Achieved🥳</h2>
                            <h2 style="font-size: 1em;" class="badge badge-info">${new Intl.NumberFormat('ZAR', { style: 'currency', currency: 'ZAR' }).format(asset.totalGoal)}</h2>
                            <span style="font-size:15px;position:absolute;right:13px" class="asset_delete">🗑️</span>
                            <span  class="badge badge-pill badge-default assetStatus" id="assetStatus" data-bs-toggle="tooltip" data-bs-placement="top" title="Click to change status">❌</span>
                            <h2 class="card-title">${asset.title.toUpperCase()}</h2>
                            <p class="card-text"><i>${asset.description}</i></p>
                            <div class="input-group mb-3">
                                <span  style="font-size: 1rem">${asset.targetStartDate}</span>  <i class="fas fa-arrow-right"></i> <span style="font-size: 1rem">${asset.targetEndDate}</span>
                            </div> 
                            
                        </div>
                       
                    </div>
                </div>
                </div> 
                    `
                        } else {
                            html += `
                            <div class="col col-sm-4 col-xs-6 asset-card" id="${asset.id}">
                            <div class="card">
                                <div class="card-header">
                                    <h2 style="font-size: 1em;" class="badge badge-info">${new Intl.NumberFormat('ZAR', { style: 'currency', currency: 'ZAR' }).format(asset.totalGoal)}</h2>
                                    <span style="font-size:15px;position:absolute;right:13px" class="asset_delete">🗑️</span>
                                    <span  class="badge badge-pill badge-default assetStatus" id="assetStatus" data-bs-toggle="tooltip" data-bs-placement="top" title="Click to change status">✔️</span>
                                    <h2 class="card-title">${asset.title.toUpperCase()}</h2>
                                    <p class="card-text"><i>${asset.description}</i></p>
                                    <div class="input-group mb-3">
                                        <span  style="font-size: 1rem">${asset.targetStartDate}</span>  <i class="fas fa-arrow-right"></i> <span style="font-size: 1rem">${asset.targetEndDate}</span>
                                    </div> 
                                </div>
                               
                            </div>
                        </div>
                        </div> 
                            `
                        }

                    }

                });
            } else {
                console.log("nothing occurred in the asset")
            }


            document.querySelector(UIselectors.assetList).innerHTML = html;
        },

        changeAssetTotal: function (totalAssets) {
            document.querySelector(UIselectors.assetSum).textContent = totalAssets;
        },

        changeRemainValue: function (remains) {
            document.querySelector(UIselectors.assetRemain).textContent = remains;
        },

        updateTotalSaved: function (total) {
            document.querySelector(UIselectors.totalSaved).textContent = total;

        },

        // gets input value
        getAssetInput: function () {
            return {
                name: document.querySelector(UIselectors.assetName).value,
                description: document.querySelector(UIselectors.assetDesc).value,
                amount: document.querySelector(UIselectors.assetAmount).value,
                startDate: document.getElementById('startpicker-input').value,
                endDate: document.getElementById('endpicker-input').value
            }
        },
        getAssetItemInput: function () {

            let assetType = document.querySelector(UIselectors.assetType);
            let optionValue = assetType.options[assetType.selectedIndex].text;

            return {
                amount: document.querySelector(UIselectors.depositAmount).value,
                asset_type: optionValue,
                depositDate: document.querySelector(UIselectors.depositDate).value
            }
        },

        clearFields: function () {
            document.querySelector(UIselectors.assetName).value = "";
            document.querySelector(UIselectors.assetDesc).value = "";
            document.querySelector(UIselectors.assetAmount).value = "";
        },

        depositClearFields: function () {
            document.querySelector(UIselectors.depositAmount).value = "";
            document.querySelector(UIselectors.assetType).value = "";
            document.querySelector(UIselectors.depositDate).value = "";
        },

    }

})();



// App Controller 

const AppController = (function (AssetController, StorageController, UIController) {

    const loadEventListeners = function () {

        //assets button
        const uiSelectors = UIController.getSelectors();

        document.querySelector(uiSelectors.addAsset).addEventListener('click', add_Asset);

        // icon button
        document.querySelector(uiSelectors.assetList).addEventListener('click', removeAsset);


        // clear asset inventory 
        document.querySelector(uiSelectors.depositBtn).addEventListener('click', clearAssets);

        // change goal status
        document.querySelector(uiSelectors.assetList).addEventListener('click', statusUpdate);

    }

    const showAllCurrency = function () {
        //show total of all assets
        const assetTotal = AssetController.getAssetSum();
        UIController.changeAssetTotal(new Intl.NumberFormat('ZAR', { style: 'currency', currency: 'Zar' }).format(assetTotal));

        // totalSave
        const totalSaved = AssetController.getAssets();
        UIController.updateTotalSaved(totalSaved.length);

    }

    const add_Asset = function (e) {

        const assetInputs = UIController.getAssetInput();

        // validation 
        if (assetInputs.name != "" || assetInputs.description != "" || assetInputs.amount != "") {
            AssetController.add_Asset(assetInputs.name, assetInputs.description, assetInputs.amount, assetInputs.startDate, assetInputs.endDate);

            const assets = AssetController.getAssets();

            UIController.showAllAssets(assets);
            showAllCurrency();
            UIController.clearFields();

            location.reload();

        } else {
            alert("Please fill in all the field");
        }

        e.preventDefault();
    }


    //remove all goals assets
    const clearAssets = function (e) {
        if (confirm('Are you sure you want to clear all goals set')) {
            localStorage.clear();
            location.reload()
        } else {
            // Do nothing!
        }

        e.preventDefault();
    }


    //delete asset
    const removeAsset = function (e) {

        const assets = JSON.parse(localStorage.getItem('assets'));
        const currentId = e.target.parentElement.parentElement.parentElement.id;

        if (e.target.classList.contains('asset_delete')) {
            assets.forEach(function (item) {
                if (item.id == currentId) {
                    StorageController.deleteAssetFromStorage(currentId);
                }
            })


        }
        e.preventDefault();
        location.reload()

    }

    // status icon
    const statusUpdate = function (e) {

        const currentId = e.target.parentElement.parentElement.parentElement.id;
        if (e.target.classList.contains('assetStatus')) {
            StorageController.updateAsset(currentId);
        }
        e.preventDefault();



    }


    // public method
    return {
        init: function () {
            const assets = AssetController.getAssets();

            UIController.showAllAssets(assets);
            //show currency
            showAllCurrency();

            // footer date
            let date = new Date();
            document.querySelector("#Date").innerHTML = date.getFullYear();

            // event loader
            loadEventListeners();

        }

    }


})(AssetController, StorageController, UIController);

AppController.init();