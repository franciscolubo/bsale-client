const $ = value => document.querySelector(value)  // - Cree una funcion para facilitar la seleccion de las etiquetas HTML

// - Realizo todas las selecciones necesarias para poder crear mi HTML dinamico

const $container = $('#container')
const $paginate = $('#paginate')
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
let obj = []

// Eventos para Ordenamientos, Filtros, SearchBar

$filters.addEventListener('change', (e) => {
    if (e.target.value === 'none') {
        return
    }
    getProductsForCategory(e.target.value)
})

$fDirection.addEventListener('change', (e) => {
    if (e.target.value === 'none') {
        return
    }
    const cad = e.target.value.split('-')
    getProductsOrdered(cad)
})

$searchbar.addEventListener('submit', (e) => {
    e.preventDefault()
    if (e.target[0].value === '') {
        return
    } else {
        getProductsSearch(e.target[0].value.trim().toUpperCase())
        e.target[0].value = ''
    }
})

const selectPage = (page) => {
    switch (typeProducts) {
        case 'getAll':
            getProductsPaginate(page)
            break;
        case 'getOrdered':
            getProductsOrdered([objOrdered.order, objOrdered.type])
            break;
        case 'getForCategory':
            getProductsForCategory(idCategory, page)
            break;
        case 'getBySearch':
            getProductsSearch(search, page)
            break;
        default:
            getProductsPaginate()
            break;
    }
}

const addCartProduct = () => {  // Funcion solo para aumentar el numero del carrito
    cart++
    $cartNum.innerHTML = cart
}

if ($container.childElementCount === 0) { // Ejecuta por si sola su funcion, llamando a las categorias y posterior a los productos, apenas se carga todo el DOM
    $container.innerHTML = `<div class="text-center"><div class="spinner-border mt-5" style="width: 5rem; height: 5rem;" role="status"></div></div>`
    getCategories()
}