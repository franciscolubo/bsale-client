const URL = 'https://bsale-api-fl.herokuapp.com/' // - URL de heroku. ¡PARA CORRER EN LOCAL CAMBIAR POR! 'http://localhost:3001/'

const $ = value => document.querySelector(value)  // - Cree una funcion para facilitar la seleccion de las etiquetas HTML

// - Realizo todas las selecciones necesarias para poder crear mi HTML dinamico

const $container = $('#container')
const $filters = $('#filters')
const $searchbar = $('#searchbar')
const $fDirection = $('#fDirection')
const $cartNum = $('#cartNum')
const $cart = $('#cart')

// - Algunas variables para apoyarme en la logica de la web

let productsHtml = ''
let categoriesHtml = '<option selected value="none">Chose a category:</option>'
let categories = []
let cart = 0
let obj = new Array()

// Funciones en las cuales realizo las peticiones a mi API

const callApiCategories = async () => {
    await fetch(URL + 'categories', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(category => { // Agrego de forma dinamica las opciones de categorias al select
                categoriesHtml += `
                <option value='${category.id}'>${category.name}</option>
                `
            })
            categories = data

            callApiProduct()  // Aqui llamo por primera vez a los productos una vez obtenidas las categorias
            $filters.innerHTML = categoriesHtml
        })
        .catch(err => console.log(err))
}

const callApiProduct = async () => {
    await fetch(URL + 'products', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => deployData(data))
        .catch(err => console.log(err))
}

const filterByCategory = async (category) => {
    await fetch(URL + `products/${category}`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => deployData(data))
        .catch(err => console.log(err))
}

const filterOrder = async (value) => {
    const obj = {
        order: value[0],
        type: value[1]
    }

    await fetch(URL + 'products', { // Envio la informacion del orden por body
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    })
        .then(response => response.json())
        .then(data => deployData(data))
        .catch(err => console.log(err))
}

// Cree deployData con el hecho de no repetir tanto codigo, ya que los ordenamientos, filtros, busquedas, llevan el mismo formato HTML

const deployData = (data) => {
    if (!data) {
        return
    }
    productsHtml = '' // Limpio la vieja cadena de texto para luego agregar la nueva
    data.forEach(product => {
        if (!product.url_image) product.url_image = '../public/notfound.jpg' // Verifico que la imagen tenga algun contenido, ya que llegaba como 'Null' o un string vacio
        productsHtml += `
                    <div class="col mb-5">
                        <div class="card h-100 justify-content-between">
                            <image src='${product.url_image}' class="card-img-top h-50" alt='image product'/>
                            <div class="p-3 h-50 d-flex flex-column justify-content-between">
                                <h5 class="fw-bold">${product.name.toUpperCase()}</h5>
                                <div class="d-flex justify-content-between align-items-center">
                                    ${product.discount > 0
                ? `<div class="d-flex">
                <p class="text-muted text-decoration-line-through">$${product.price}</p>
                <p style="margin-left: 4px;"> > $${product.price - (product.price * product.discount) / 100}</p>
                </div>`
                : `<p>$${product.price}</p>`
            }
                                    <button class="btn btn-outline-dark mt-auto w-25" id="cart" onclick="addCartProduct(${product.id})">
                                        <svg width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
                                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `
    })
    $container.innerHTML = productsHtml // Creo un texto con templates para luego formar mi HTML dinamico, donde veran los productos
}

// Eventos para Ordenamientos, Filtros, SearchBar

$filters.addEventListener('change', (e) => {
    if (e.target.value === 'none') {
        return
    }
    filterByCategory(e.target.value)
})

$fDirection.addEventListener('change', (e) => {
    if (e.target.value === 'none') {
        return
    }
    const cad = e.target.value.split('-')
    filterOrder(cad)
})

$searchbar.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (e.target[0].value === '') {
        return
    } else {
        await fetch(URL + `products/search/${e.target[0].value.trim().toUpperCase()}`)
            .then(response => response.json())
            .then(data => deployData(data))
            .catch(err => console.log(err))

        e.target[0].value = ''
    }
})

const addCartProduct = () => {  // Funcion solo para aumentar el numero del carrito
    cart++
    $cartNum.innerHTML = cart
}

if ($container.childElementCount === 0) { // Ejecuta por si sola su funcion, llamando a las categorias y posterior a los productos, apenas se carga todo el DOM
    $container.innerHTML = `<div class="text-center"><div class="spinner-border mt-5" style="width: 5rem; height: 5rem;" role="status"></div></div>`
    callApiCategories()
}
