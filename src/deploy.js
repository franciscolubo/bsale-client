// Cree deployData con el hecho de no repetir tanto codigo, ya que los ordenamientos, filtros, busquedas, llevan el mismo formato HTML

const deployData = (data) => {
    if (data.data.length === 0) {
        productsHtml = 'No hay resultados para esta busqueda'
        $paginate.innerHTML = ''
        setTimeout(() => {
            getProductsPaginate()
        }, 2000)
    } else {
        productsHtml = '' // Limpio la vieja cadena de texto para luego agregar la nueva
        data.data.forEach(product => {
            console.log(product.urlImage)
            if (!product.urlImage) product.urlImage = '../public/notfound.jpg'; // Verifico que la imagen tenga algun contenido, ya que llegaba como 'Null' o un string vacio
            productsHtml += `
                    <div class="col mb-5">
                        <div class="card h-100 justify-content-between">
                            <image src='${product.urlImage}' class="card-img-top h-50" alt='image product'/>
                            <div class="p-3 h-50 d-flex flex-column justify-content-between">
                                <h5 class="fw-bold">${product.title.toUpperCase()}</h5>
                                <div class="d-flex justify-content-sm-between align-items-center">
                                    ${product.discount > 0
                    ? `<div class="d-sm-flex flex-sm-column flex-md-row">
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

        deployPaginate(data.totalRows, data.actuallyPage)
    }
    $container.innerHTML = productsHtml // Creo un texto con templates para luego formar mi HTML dinamico, donde veran los productos
}

const deployPaginate = (totalRows, actuallyPage) => {
    console.log(totalRows)
    const allPages = Math.ceil(totalRows / 10)
    console.log(allPages)
    let pageHtml = `<li class="page-item"><buttton class="page-link ${actuallyPage === 1 && 'd-none'}" onClick="selectPage(${(actuallyPage - 1)})"><</button></li>`

    for (let i = 1; i <= allPages; i++) {
        pageHtml += `<li class="page-item"><buttton class="page-link" onClick="selectPage(${i})">${i}</button></li>`
    }

    pageHtml += `<li class="page-item"><buttton class="page-link ${actuallyPage === allPages && 'd-none'}" onClick="selectPage(${(actuallyPage + 1)})">></button></li>`
    $paginate.innerHTML = pageHtml
}