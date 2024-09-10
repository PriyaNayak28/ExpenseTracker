


function addExpense(event) {
    event.preventDefault();

    const expense = event.target.expense.value;
    const desc = event.target.desc.value;
    const category = event.target.category.value;


    const obj = {
        expense,
        desc,
        category
    }

    const token = localStorage.getItem('token')
    axios.post("http://localhost:3000/expense/add-expense", obj, { headers: { "Authorization": token } })
        .then((response) => {
            display(response.data.newExpenseDetail)
            console.log(response)
        })
        .catch((err) => {
            console.log(err)
        })

}

function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = " "
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


window.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem('token')
    const decodeToken = parseJwt(token)
    console.log(decodeToken)
    const ispremiumuser = decodeToken.ispremiumuser
    if (ispremiumuser) {
        showPremiumuserMessage()
        showLeaderboard()
    }

    const page = 1;
    axios.get(`http://localhost:3000/expense/get-expense/${page}`, { headers: { "Authorization": token } })
        .then((response) => {
            console.log(response)
            for (var i = 0; i < response.data.allExpenses.length; i++) {
                display(response.data.allExpenses[i])
            }
            showpagination(response.data);
        })
        .catch((error) => {
            console.log(error)
        })


})

function display(obj) {


    if (localStorage.getItem(obj.desc) !== null) {
        removeUserfromscreen(obj.desc)
    }

    const parentElem = document.getElementById('item-list');
    const childElem = `<li id=${obj.id}>Rs ${obj.expense} - ${obj.desc} - ${obj.category}
                        <button class='delete' onclick=deleteExpense(event,'${obj.id}')>Delete</button>

                        </li>`
    parentElem.innerHTML = parentElem.innerHTML + childElem;
}

//delete button
function deleteExpense(e, expenseId) {
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, { headers: { "Authorization": token } })
        .then((response) => {
            removeUserfromscreen(expenseId)
        })
        .catch((err) => {
            console.log(err)
        })

}

//edit button
function editUser(expense, desc, category, userId) {
    document.getElementById('expense').value = expense;
    document.getElementsById('desc').value = desc;
    document.getElementById('category').value = category;

    deleteUser(userId);


}

function showLeaderboard() {
    const inputElement = document.createElement("input")
    inputElement.className = "leaderboardbtn"
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard'
    inputElement.onclick = async () => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: { "Authorization": token } })
        console.log(userLeaderBoardArray)

        var leaderboardElem = document.getElementById('leaderboard')
        // leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.totalExpenses} </li>`
        })
    }
    document.getElementById("message").appendChild(inputElement);

}

//remove user from screen
function removeUserfromscreen(userId) {
    const parentElem = document.getElementById('item-list');
    const childElemtobedeleted = document.getElementById(userId);
    if (childElemtobedeleted) {
        parentElem.removeChild(childElemtobedeleted);
    }


}

document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: { "Authorization": token } });
    console.log(response);
    var options =
    {
        "key": response.data.key_id,
        "order_id": response.data.order.id,

        "handler": async function (response) {
            const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } })

            console.log(res)
            alert('You are a Premium User Now')
            document.getElementById('rzp-button1').style.visibility = "hidden"
            document.getElementById('message').innerHTML = "You are a premium user "
            localStorage.setItem('token', res.data.token)
            showLeaderboard()

        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        console.log(response)
        alert('Something went wrong')
    });
}
function showpagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
}) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (hasPreviousPage) {
        const btn2 = document.createElement('button')
        btn2.innerHTML = previousPage
        btn2.addEventListener('click', () => getExpenses(previousPage))
        pagination.appendChild(btn2)
    }
    const btn1 = document.createElement('button')
    btn1.innerHTML = `<h3>${currentPage}</h3>`
    btn1.addEventListener('click', () => getExpenses(currentPage))
    pagination.appendChild(btn1)
    if (hasNextPage) {
        const btn3 = document.createElement('button')
        btn3.innerHTML = nextPage
        btn3.addEventListener('click', () => getExpenses(nextPage))
        pagination.appendChild(btn3)
    }
}

function getExpenses(page) {
    const token = localStorage.getItem('token')
    const parentElem = document.getElementById('item-list');
    parentElem.innerHTML = '';
    axios.get(`http://localhost:3000/expense/get-expense/${page}`, { headers: { "Authorization": token } })
        .then((response) => {
            console.log(response)
            for (var i = 0; i < response.data.allExpenses.length; i++) {
                display(response.data.allExpenses[i])
            }
            showpagination(response.data);
        })
        .catch((error) => {
            console.log(error)
        })
}


