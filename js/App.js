// Asset -- Controller
const AssetController = (function () {

    const nowDate = new Date();

    const Asset = function (id, title, description, totalGoal, obj) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.totalGoal = totalGoal;
        this.obj = obj;
    }

    //data structure / state
    // hard-code
    const data = {
        Asset: [
            {
                id: 1, title: 'Car Saves', description: "save for car", totalGoal: 4000,
                obj: { saveId: 1, price: 1000, timeStamp: nowDate }
            },
            {
                id: 2, title: 'Travel', description: "save to go to Germany", totalGoal: 10000,
                obj: { saveId: 2, price: 1000, timeStamp: nowDate }
            },
            {
                id: 3, title: 'House', description: "save for a house", totalGoal: 50000,
                obj: { saveId: 3, price: 1000, timeStamp: nowDate }
            },
        ],

        totalSaves: 0,
        totalRemains: 0,
        sumOfAssets: 0,
    }

    // public methods
    return {
        getAssets: function () {
            return data.Asset;
        },

        logData: function () {
            return data;
        },


        getTotalSaves: function () {
            let total = 0;
            data.Asset.forEach(function (asset) {
                total += asset.obj.price;
            })

            data.totalSaves = total;
            return data.totalSaves;
        },

        // sum of all the assets
        getAssetSum: function () {
            let total = 0;
            data.Asset.forEach(function (asset) {
                total += asset.totalGoal;
            })

            data.sumOfAssets = total;
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
        add_Asset: function (title, description, amount) {
            // logic here
            let ID;

            const tempObj = {
                saveId: 4,
                price: 2000,
                timeStamp: Date.now()
            }

            if (data.Asset.length > 0) {
                ID = data.Asset[data.Asset.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // convert amount to number
            amount = parseFloat(amount);
            newAsset = new Asset(ID, title, description, amount, tempObj);


            data.Asset.push(newAsset);


            return newAsset;
        },

    }

})();


// UI -- Controller 
const UIController = (function () {
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
        deleteIcon: "#asset_delete"



    }

    //public methods
    return {

        getSelectors: function () {
            return UIselectors;
        },

        showAllAssets: function (assets) {

            let html = '';

            assets.forEach(function (asset) {
                html += `
                <div class="col col-sm-4 col-xs-6 asset-card" id="${asset.id}">
                <div class="card">
                    <div class="card-header">
                        <h2 style="font-size: 1em;" class="badge badge-info">${new Intl.NumberFormat('ZAR', { style: 'currency', currency: 'ZAR' }).format(asset.totalGoal)}</h2>
                        <span style="font-size:15px;position:absolute;right:13px" class="badge badge-pill badge-danger asset_delete">X</span>
                        <h2 class="card-title">${asset.title}</h2>
                        <p class="card-text"><i>${asset.description}</i></p>
                        <div class="input-group mb-3">
                        </div>
                    </div>
                    <div class="card-body">
                        <ul>
                            <li>R${asset.obj.price}</li>
                        </ul>
                    </div>
                </div>
            </div>
            </div> 
                `
            });

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
            }
        },

        clearFields: function () {
            document.querySelector(UIselectors.assetName).value = "";
            document.querySelector(UIselectors.assetDesc).value = "";
            document.querySelector(UIselectors.assetAmount).value = "";
        },

    }

})();



// App Controller 

const AppController = (function (AssetController, UIController) {

    const loadEventListeners = function () {

        //assets button
        const uiSelectors = UIController.getSelectors();

        document.querySelector(uiSelectors.addAsset).addEventListener('click', add_Asset);

        // icon button
        document.querySelector(uiSelectors.assetList).addEventListener('click', removeAsset);

    }

    const showAllCurrency = function () {
        //show total of all assets
        const assetTotal = AssetController.getAssetSum();
        UIController.changeAssetTotal(new Intl.NumberFormat('ZAR', { style: 'currency', currency: 'Zar' }).format(assetTotal));

        // remain
        const remainCash = AssetController.displayRemains();
        UIController.changeRemainValue(new Intl.NumberFormat('ZAR', { style: 'currency', currency: 'Zar' }).format(remainCash));

        // totalSave
        const totalSaved = AssetController.getTotalSaves();
        UIController.updateTotalSaved(new Intl.NumberFormat('ZAR', { style: 'currency', currency: 'Zar' }).format(totalSaved));

    }

    const add_Asset = function (e) {

        const assetInputs = UIController.getAssetInput();

        // validation 
        if (assetInputs.name != "" || assetInputs.description != "" || assetInputs.amount != "") {
            AssetController.add_Asset(assetInputs.name, assetInputs.description, assetInputs.amount);

            const assets = AssetController.getAssets();

            UIController.showAllAssets(assets);
            showAllCurrency()
            UIController.clearFields();

        } else {
            alert("Please fill in all the field");
        }

        e.preventDefault();
    }




    //delete asset
    const removeAsset = function (e) {

        if (e.target.classList.contains('asset_delete')) {
            e.target.parentNode.parentNode.parentNode.remove();
        }

        // update the currency at the


        e.preventDefault();
    }



    // public method
    return {
        init: function () {
            const assets = AssetController.getAssets();

            UIController.showAllAssets(assets);

            showAllCurrency();

            // event loader
            loadEventListeners();
        }

    }


})(AssetController, UIController);

AppController.init();