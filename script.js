document.getElementById('btn-login').addEventListener('click', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm.style.display === 'none' || loginForm.style.display === '') {
        loginForm.style.display = 'block';
    } else {
        loginForm.style.display = 'none';
    }
});

document.getElementById('btn-register').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        alert('Usuario registrado con éxito!');
        document.getElementById('login-form').style.display = 'none';
    } else {
        alert('Por favor, completa todos los campos.');
    }
});

document.getElementById('search-btn').addEventListener('click', function() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    alert(`Buscando producto: ${searchValue}`);
});

const cartItems = document.getElementById('cart-items');
const productButtons = document.querySelectorAll('.product-btn');

productButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
        const productName = this.parentElement.querySelector('h3').textContent;
        const productPrice = this.parentElement.querySelector('p').textContent;
        const li = document.createElement('li');
        li.textContent = `${productName} - ${productPrice}`;
        cartItems.appendChild(li);
    });
});

document.getElementById('checkout-btn').addEventListener('click', function() {
    if (cartItems.children.length > 0) {
        alert('Procesando pago...');
    } else {
        alert('Tu carrito está vacío.');
    }
});

const mp = new MercadoPago('YOUR_PUBLIC_KEY', {
    locale: 'es-AR'
});

mp.getIdentificationTypes().then(function (data) {
    let docTypeElement = document.getElementById('form-docType');
    data.forEach(docType => {
        let option = document.createElement('option');
        option.value = docType.id;
        option.textContent = docType.name;
        docTypeElement.appendChild(option);
    });
});

document.getElementById('paymentForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const cardForm = mp.cardForm({
        amount: "100.00", 
        autoMount: true,
        form: {
            id: "paymentForm",
            cardholderName: {
                id: "form-cardholderName"
            },
            cardNumber: {
                id: "form-cardNumber"
            },
            expirationDate: {
                id: "form-cardExpiration"
            },
            securityCode: {
                id: "form-securityCode"
            },
            docType: {
                id: "form-docType"
            },
            docNumber: {
                id: "form-docNumber"
            }
        },
        callbacks: {
            onFormMounted: error => {
                if (error) return console.error("Form Mounted handling error: ", error);
                console.log("Form mounted");
            },
            onSubmit: event => {
                event.preventDefault();

                const {
                    paymentMethodId,
                    issuerId,
                    cardholderEmail,
                    token,
                    installments,
                    identificationNumber,
                    identificationType
                } = cardForm.getCardFormData();

                fetch("https://tu-servidor.com/procesar-pago", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token,
                        issuerId,
                        paymentMethodId,
                        transactionAmount: 100, // El monto total
                        installments: 1, // Cuotas
                        description: "Pago en Tienda de Informática",
                        payer: {
                            email: "test@test.com", // Email del usuario
                            identification: {
                                type: identificationType,
                                number: identificationNumber
                            }
                        }
                    })
                }).then(function (response) {
                    return response.json();
                }).then(function (result) {
                    document.getElementById('paymentResponse').innerText = "Pago exitoso: " + result.status;
                }).catch(function (error) {
                    document.getElementById('paymentResponse').innerText = "Error en el pago: " + error;
                });
            }
        }
    });
});

function searchProducts() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        let productName = card.querySelector('h3').innerText.toLowerCase();
        if (productName.includes(input)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
document.getElementById("payment-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const cardNumber = document.getElementById("cardNumber").value;
    const cardHolder = document.getElementById("cardHolder").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;
    const paymentMethod = document.getElementById("paymentMethod").value;

    if (validatePayment(cardNumber, expiryDate, cvv)) {
        document.getElementById("payment-result").style.display = "block";
    } else {
        alert("Error en los datos del pago. Por favor, revisa la información.");
    }
});

function validatePayment(cardNumber, expiryDate, cvv) {
    // Validar formato de tarjeta (simple)
    const cardNumberRegex = /^[0-9]{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
    const cvvRegex = /^[0-9]{3}$/;

    if (!cardNumberRegex.test(cardNumber)) {
        alert("Número de tarjeta inválido");
        return false;
    }

    if (!expiryDateRegex.test(expiryDate)) {
        alert("Fecha de expiración inválida");
        return false;
    }

    if (!cvvRegex.test(cvv)) {
        alert("CVV inválido");
        return false;
    }

    return true;
}
document.getElementById("register-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }

    registerUser(username, email, password);
});

function registerUser(username, email, password) {
    const userData = {
        username: username,
        email: email,
        password: password
    };

    console.log("Usuario registrado:", userData);

    document.getElementById("register-result").style.display = "block";
}

