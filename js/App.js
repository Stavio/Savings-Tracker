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
            { id: 1, title: 'Car Saves', description: "save for car", totalGoal: 4000, obj: { saveId: 1, price: 1000, timeStamp: nowDate } },
            { id: 2, title: 'Travel', description: "save to go to Germany", totalGoal: 10000, obj: { saveId: 2, price: 1000, timeStamp: nowDate } },
            { id: 3, title: 'House', description: "save for a house", totalGoal: 50000, obj: { saveId: 3, price: 1000, timeStamp: nowDate } },
        ],

        totalSaves: 0,
        totalRemains: 0,
        sumOfAssets: 0
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

        getAssetSum: function () {
            let total = 0;
            data.Asset.forEach(function (asset) {
                total += asset.totalGoal;
            })

            data.sumOfAssets = total;
            return data.sumOfAssets;
        }


    }

})();


// UI -- Controller 
const UIController = (function () {
    const UIselectors = {
        assetList: "#asset-list",
        assetSum: "#sumOfTarget"
    }


    //public methods
    return {

        showAllAssets: function (assets) {

            let html = '';

            assets.forEach(function (asset) {
                html += `
                <div class="col">
                <div class="card">
                    <div class="card-header">
                        <h2 class="badge badge-info">${new Intl.NumberFormat('ZAR', { style: 'currency', currency: 'ZAR' }).format(asset.totalGoal)}</h2>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="add funds to target"
                                aria-label="add funds to target" aria-describedby="button-addon2">
                            <button class="btn btn-outline-secondary" type="button"
                                id="button-addon2">Add</button>
                        </div>
                    </div>
                    <div class="card-body">
                        <h2 class="card-title ">${asset.title}</h2>
                        <p class="card-text">${asset.description}</p>
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
        }

    }

})();



// App Controller 

const AppController = (function (AssetController, UIController) {

    // public method
    return {
        init: function () {
            const assets = AssetController.getAssets();

            UIController.showAllAssets(assets);

            //show total of all assets
            const assetTotal = AssetController.getAssetSum();
            UIController.changeAssetTotal(new Intl.NumberFormat('ZAR', { style: 'currency', currency: 'Zar' }).format(assetTotal));

        }

    }


})(AssetController, UIController);

AppController.init();