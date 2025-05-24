class Tracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit(1800);
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkout();
    this._displayCaloriesConsumed();
    this._displayCaloriesTotal();
    this._displayCalorieLimit();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._progressBar();
    this._loadItems();
  }

  _loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }
  addMeal(meal) {
    this._meals.push(meal);
    Storage.setMeals(meal);
    this._totalCalories += meal.calories;
    Storage.setTotalCalories(this._totalCalories);
    console.log(this._meals);
    this._displayNewMeal(meal);
  }
  addWorkout(workout) {
    this._workouts.push(workout);
    Storage.setWorkout(workout);
    this._totalCalories -= workout.calories;
    Storage.setTotalCalories(this._totalCalories);

    this._displayNewWorkout(workout);
  }

  _displayCaloriesTotal() {
    const totalCalorieEl = document.getElementById('calories-total');
    totalCalorieEl.textContent = this._totalCalories;
  }

  _displayCalorieLimit() {
    const calorieLimitEl = document.getElementById('calories-limit');
    calorieLimitEl.textContent = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const sum = this._meals.reduce((total, meal) => total + meal.calories, 0);
    const caloriesConsumed = document.getElementById('calories-consumed');
    caloriesConsumed.textContent = sum;
    // this._render();
  }
  _displayCaloriesBurned() {
    const sum = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    const caloriesBurned = document.getElementById('calories-burned');
    caloriesBurned.textContent = sum;
    // this._render();
  }
  _displayCaloriesRemaining() {
    const remainingEl = document.getElementById('calories-remaining');
    remainingEl.textContent = this._calorieLimit - this._totalCalories;
  }
  _calorieAlert() {
    const remainingEl =
      document.getElementById('calories-remaining').parentElement;
    const progress = document.getElementById('calorie-progress');
    if (this._totalCalories > this._calorieLimit) {
      remainingEl.style.backgroundColor = 'red';
      progress.style.backgroundColor = 'red';
    } else {
      remainingEl.style.backgroundColor = 'white';
      progress.style.backgroundColor = 'green';
    }
  }

  _progressBar() {
    const progress = document.getElementById('calorie-progress');
    const percent = (this._totalCalories / this._calorieLimit) * 100;
    progress.style.width = percent + '%';
  }
  _displayNewMeal(meal) {
    const mealsEl = document.getElementById('meal-items');
    const mealEl = document.createElement('div');
    mealEl.classList.add('card', 'my-2');
    mealEl.setAttribute('data-id', meal.id);
    mealEl.innerHTML = `
    <div class="card-body">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${meal.name}</h4>
      <div
        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
      >
        ${meal.calories}
      </div>
      <button class="delete btn btn-danger btn-sm mx-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
    `;

    mealsEl.appendChild(mealEl);
  }

  _displayNewWorkout(workout) {
    const workoutsEl = document.getElementById('workout-items');
    const workoutEl = document.createElement('div');
    workoutEl.classList.add('card', 'my-2');
    workoutEl.setAttribute('data-id', workout.id);
    workoutEl.innerHTML = `
    <div class="card-body">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${workout.name}</h4>
      <div
        class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
      >
        ${workout.calories}
      </div>
      <button class="delete btn btn-danger btn-sm mx-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
    `;

    workoutsEl.appendChild(workoutEl);
  }

  _removeMeal(id) {
    this._meals.forEach((meal) => {
      if (meal.id === id) {
        const index = this._meals.indexOf(meal);
        this._totalCalories -= meal.calories;
        Storage.removeMeal(id);
        this._meals.splice(index, 1);
        Storage.setTotalCalories(this._totalCalories);
      }
    });
  }

  _removeWorkout(id) {
    Storage.removeWorkout(id);
    this._workouts.forEach((workout) => {
      if (workout.id === id) {
        const index = this._workouts.indexOf(workout);
        this._totalCalories += workout.calories;
        this._workouts.splice(index, 1);
        Storage.setTotalCalories(this._totalCalories);
      }
    });
  }

  _setLimit(limit) {
    this._calorieLimit = limit;
    Storage.setCalorieLimit(limit);
    this._render();
  }
  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCalorieLimit();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._calorieAlert();
    this._progressBar();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem('calorieLimit') === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem('calorieLimit');
    }
    return calorieLimit;
  }
  static setCalorieLimit(limit) {
    localStorage.setItem('calorieLimit', limit);
  }
  static getTotalCalories(defaultTotal) {
    let totalCalories;
    if (localStorage.getItem('totalCalories') === null) {
      totalCalories = defaultTotal;
    } else {
      totalCalories = +localStorage.getItem('totalCalories');
    }
    return totalCalories;
  }

  static setTotalCalories(calories) {
    localStorage.setItem('totalCalories', calories);
  }

  static getMeals() {
    let meals;
    if (localStorage.getItem('meals') === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem('meals'));
    }
    return meals;
  }

  static setMeals(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
  }
  static getWorkout() {
    let workout;
    if (localStorage.getItem('workout') === null) {
      workout = [];
    } else {
      workout = JSON.parse(localStorage.getItem('workout'));
    }
    return workout;
  }

  static setWorkout(workout) {
    const workouts = Storage.getWorkout();
    workouts.push(workout);
    localStorage.setItem('workout', JSON.stringify(workouts));
  }

  static removeMeal(id) {
    const meals = this.getMeals();
    const filtered = meals.filter((meal) => meal.id !== id);
    localStorage.setItem('meals', JSON.stringify(filtered));
  }

  static removeWorkout(id) {
    const workouts = this.getWorkout();
    const filtered = workouts.filter((workout) => workout.id !== id);
    localStorage.setItem('workout', JSON.stringify(filtered));
  }
}

class App {
  constructor() {
    this.tracker = new Tracker();
    document;
    document
      .getElementById('meal-form')
      .addEventListener('submit', (e) => this._newItem(e, 'meal'));

    document
      .getElementById('workout-form')
      .addEventListener('submit', (e) => this._newItem(e, 'workout'));
    document
      .getElementById('meal-items')
      .addEventListener('click', (e) => this._removeItem(e, 'meal'));
    document
      .getElementById('workout-items')
      .addEventListener('click', (e) => this._removeItem(e, 'workout'));
    document
      .getElementById('limit-form')
      .addEventListener('submit', (e) => this._setLimit(e));
    document
      .getElementById('filter-meals')
      .addEventListener('input', (e) => this._filterItems(e, 'meals'));
  }

  _newItem(e, type) {
    e.preventDefault();
    const name = document.querySelector(`#${type}-name`).value.trim();
    const caloriesString = document.querySelector(`#${type}-calories`).value;
    const calories = parseInt(caloriesString);

    console.log(calories);
    if (name === '' || isNaN(calories) || calories <= 0) {
      alert('please enter in the correct values');
      return;
    }

    if (type === 'meal') {
      const meal = new Meal(name, calories);
      this.tracker.addMeal(meal);
      this.tracker._render();
    } else if (type === 'workout') {
      const workout = new Workout(name, calories);
      this.tracker.addWorkout(workout);
      this.tracker._render();
    }
  }

  _removeItem(e, type) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      const card = e.target.closest('.card');
      const id = card.getAttribute('data-id');
      card.remove();
      if (type === 'meal') {
        this.tracker._removeMeal(id);
      }
      if (type === 'workout') {
        this.tracker._removeWorkout(id);
      }
      this.tracker._render();
    }
  }

  _setLimit(e) {
    e.preventDefault();
    const limitV = document.getElementById('limit').value;
    if (limitV === '') {
      alert('enter a value');
      return;
    }

    const limit = parseInt(limitV);
    this.tracker._setLimit(limit);
  }

  _filterItems(e, type) {
    if (type === 'meals') {
      const mealItems = document.querySelector('#meal-items');
      const meals = mealItems.querySelectorAll('.card');
      const inp = document.getElementById('filter-meals');
      meals.forEach((meal) => {
        const h4 = meal.querySelector('h4').textContent.toLowerCase();
        if (!h4.includes(inp.value)) {
          meal.style.display = 'none';
        } else meal.style.display = 'flex';
      });
    }
  }
}

const app = new App();
