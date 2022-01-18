var type;
var s_date;
var e_date;

// user input
input();

function input() {
    type = prompt("Enter Type(active/Superactive/bored)");
    s_date = prompt("Enter Starting Date(2016-09-01)");
    e_date = prompt("Enter Ending Date(2016-09-08)");

    // validate user input data
    validation();
}

function validation() {
    // null checking
    if (type == "" || s_date == "" || e_date == "") {
        window.alert("Please enter valid data");

        input();
    }

    // user-type spell check
    else if (type == "active" || type == "Superactive" || type == "bored") {

        // if user input valid then main function will work from here
        main();
    } else {
        window.alert("Please enter valid user-type");
        input();
    }
}


function main() {
    var cal_s_month = parseInt(s_date.substring(5, 7));
    var cal_e_month = parseInt(e_date.substring(5, 7));
    var cal_s_date = parseInt(s_date.substring(8, 11));
    var cal_e_date = parseInt(e_date.substring(8, 11));


    var store_dayId = [];
    let user_list = [];
    var json_files = ["2", "7", "2627", "10780", "13116", "14842", "17172", "20566", "21632", "27366", "29127", "30024", "30332", "31870", "33550", "34407", "34429", "36495", "37327", "38639"];
    var day_id;
    var list_size = 0;
    var user_id_calc;
    var count_total_meal = 0;
    var final_list = "";


    function jsonParser(json_object) {
        for (var i in json_object.calendar.dateToDayId) {

            var temp_date = parseInt(i.substring(8, 11));
            var temp_month = parseInt(i.substring(5, 7));


            if (cal_s_month <= temp_month && cal_e_month >= temp_month && temp_date >= cal_s_date && temp_date <= cal_e_date) {
                store_dayId.push(json_object.calendar.dateToDayId[i]);

            }
            day_id = json_object.calendar.dateToDayId[i];
        }

        // count total meal of a specific user
        for (var i in store_dayId) {
            for (var j in json_object.calendar.mealIdToDayId) {
                if (json_object.calendar.mealIdToDayId[j] == store_dayId[i]) {
                    count_total_meal++;
                }
            }
        }
        user_id_calc = (json_object.calendar.daysWithDetails[day_id].day.userId).toString();

    }

    function helperFunc(myFile) {
        if (type == "active" && count_total_meal >= 5 && count_total_meal < 10) {
            user_list.push(user_id_calc);
            console.log(user_id_calc);
            list_size++;

        } else if (type == "Superactive" && count_total_meal > 10) {
            user_list.push(user_id_calc);
            console.log(user_id_calc);
            list_size++;

        } else if (type == "bored" && count_total_meal < 5) {
            user_list.push(user_id_calc);
            //	console.log(user_id_calc);
            list_size++;
        }

        count_total_meal = 0;
        store_dayId = [];
    }


    function dataViewer(view) {
        for (var j in user_list) {
            final_list += user_list[j] + ", ";

        }


        //console.log(final_list);
        document.getElementById("h3").innerHTML = type + " users: " + final_list.substring(0, final_list.length - 2);
        document.getElementById("h1").innerHTML = "Total " + type + " users: " + list_size;
        document.getElementById("h4").innerHTML = "Starting Date: " + s_date;
        document.getElementById("h5").innerHTML = "Ending Date: " + e_date;


        user_list = [];

    }


    for (var x in json_files) {
        var json_path = '../data/' + json_files[x] + '.json';

        fetch(json_path)
            .then(data => data.json())
            .then(json_object => jsonParser(json_object))
            .then(myFile => helperFunc(myFile))
            .then(view => dataViewer(view));
    }

}
