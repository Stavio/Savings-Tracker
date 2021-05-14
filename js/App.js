// get id of modal
const addAsset = document.querySelector('#addAsset');
addAsset.addEventListener('click', function () {
    console.log("hello world");
});


// Asset -- Controller
const AssetController = (function () {

    const Asset = function (id, title, description, totalGoal, obj) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.totalGoal = totalGoal;
        this.obj = obj;
    }

    //data structure / state

    const data = {
        Asset: {

        }
    }

    // public methods
    return {

    }

})();


// UI -- Controller 
const UIController = (function () {

    //public methods
    return {


    }

})();



// App Controller 

const AppController = (function (AssetController, UIController) {


    // public method
    return {

    }


})(AssetController, UIController);