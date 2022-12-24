if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}
const searchbtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const recipe_close_btn = document.getElementById('recipe-close-btn');
const mealDetailsContent = document.querySelector('.meal-details-content');
const favitem = document.getElementById('favitem');
const fav_list = document.getElementById('fav_list');
const con = document.getElementById('con');
searchbtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
const favitemarr = new Array();
recipe_close_btn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
})
async function fetchMealsFromApi(url, value) {
    const res = await fetch(`${url + value}`);
    const meals = await res.json();
    console.log(meals);
    return meals;
}

async function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    console.log(searchInputTxt);
    await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                <div class="meal-item"data-id = "${meal.idMeal}">
                    <div class="meal-image">
                        <img class="image1"src="${meal.strMealThumb}" alt="food">
                        <img class="image2"id="hearticon"style="width:1.8rem;height:1.8rem;"src="https://cdn-icons-png.flaticon.com/128/4340/4340223.png"onclick="addRemoveToFavList(${meal.idMeal})">
                    </div>
                   <div class="meal-name">
                       <h3>${meal.strMeal}</h3>
                     </div>
                       <a href="#" class="recipe-btn"onclick="getMealRecipe(${meal.idMeal})">Get recipe</a>
                   </div>
                </div>
                `;
                });
                mealList.classList.remove('notfound');

            }
            else {
                html = "sorry, don't find any meal";
                mealList.classList.add('notfound');
            }
            mealList.innerHTML = html;
        })
}
async function getMealRecipe(id)
{
    // console.log(id);
    let url = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
    let html='';
    await fetchMealsFromApi(url,id).then(data => {
        // console.log(meals[0]);
         html += `
            <h2 class="recipe-ttle">${data.meals[0].strMeal}</h2>
            <p class="recipe-category">${data.meals[0].strCategory}</p>
            <div class="recipe-instruct">
                <h3>Instructions</h3>
                <p>${data.meals[0].strInstructions}</p>
             </div>
            <div class="recipe-link-img">
                <img src="${data.meals[0].strMealThumb}" alt="meal">
            </div>
            <div class="recipe-link">
                <a href="${data.meals[0].strYoutube}"target="_blank">Watch video</a>
            </div>
            `;
    })
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
    favitem.style.display="none"
    // document.getElementById('navbar').style.opacity="0"
    // con.style.display="none"
}
async function showFavList() {
    if (favitem.style.display === "none") {
        favitem.style.display = "block";
        // con.style.backgroundColor="black";
      } else {
        favitem.style.display = "none";
        
        // con.style.backgroundColor="#DD1042";
        
      }
    // favitem.style.display = "block";
    let html = "";
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    // console.log(arr);
    let url = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
    if (arr.length == 0) {
        console.log("no");
        html += `
        <h1>no item found</h1>
      `   
    }
    else {
        for (let i = 0; i < arr.length; i++) {
            await fetchMealsFromApi(url, arr[i]).then(data => {
                console.log(arr[0]);
                html += `
                <div class="meal-item">
            <div class="meal-image">
                <img class="image1"src="${data.meals[0].strMealThumb}"style="height:20rem;" alt="food">
                <img class="image2"id="hearticon"style="width:1.8rem;height:1.8rem;"src="https://cdn-icons-png.flaticon.com/128/4340/4340223.png"onclick="addRemoveToFavList(${data.meals[0].idMeal})">
            </div>
           <div class="meal-name">
               <center><h2>${data.meals[0].strMeal}</h2></center>
             </div>
               <a href="#" class="recipe-btn"onclick="getMealRecipe(${data.meals[0].idMeal})">Get recipe</a>
           </div>
          </div> 
            
            `;
            });

        }
    }
    favitem.innerHTML = html;
}
function addRemoveToFavList(id) {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let contain = false;
    for (let index = 0; index < arr.length; index++) {
        if (id == arr[index]) {
            contain = true;
        }
    }
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("your meal removed from your favourites list");

        // console.log(arr);
    } else {
        arr.push(id);
        alert("your meal add your favourites list");
    }
    localStorage.setItem("favouritesList", JSON.stringify(arr));
    showFavList();
}




