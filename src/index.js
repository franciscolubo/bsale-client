const URL = 'http://localhost:3001/'

const $container = document.querySelector('#container')
const $filters = document.querySelector('#filters')
let productsHtml = ''
let categoriesHtml = ''
let categories = []

const callApiProduct = async () => {
    await fetch(URL + 'products', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => deployData(data))
        .catch(err => console.log(err))
}

const callApiCategories = async () => {
    await fetch(URL + 'categories', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(category => {
                categoriesHtml += `
                <option value='${category.id}'>${category.name}</option>
                `
            })
            categories = data

            callApiProduct()
            $filters.innerHTML = categoriesHtml
        })
        .catch(err => console.log(err))
}

const filterByCategory = async (category) => {
    await fetch(URL + `categories/${category}`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => deployData(data))
        .catch(err => console.log(err))
}

const deployData = (data) => {
    productsHtml = ''
    data.forEach(product => {
        if (!product.url_image) product.url_image = '../public/notfound.jpg'
        productsHtml += `
                    <div class="col mb-5">
                        <div class="card h-100">
                            <image src='${product.url_image}' class="card-img-top h-50" alt='image product'/>
                            <div class="card-body p-4">
                                <div class="text-center">
                                    <h5 class="fw-bolder">${product.name.toUpperCase()}</h5>
                                    <p>$${product.price}</p>
                                    <p>${product.discount}%</p>
                                    <p>${categories[product.category - 1].name}</p>
                                    <button class="btn btn-outline-dark mt-auto">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `
    })
    $container.innerHTML = productsHtml
}


if ($container.childElementCount === 0) {
    $container.innerHTML = `<h2>Cargando todo</h2>`
    callApiCategories()
}