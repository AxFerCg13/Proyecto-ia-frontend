// Definición completa de preguntas
const questions = [
    "¿Qué tanto te interesa visitar lugares históricos o culturales?",
    "¿Qué tanto te gusta estar en contacto con la naturaleza?",
    "¿Qué tanto te interesa visitar pueblos mágicos o tradicionales?",
    "¿Qué tanto disfrutas la vida nocturna o salir de fiesta?",
    "¿Qué tanto te interesan los recorridos gastronómicos y vinícolas?",
    "¿Qué tanto te interesan las actividades de aventura o extremas?",
    "¿Qué tanto prefieres lugares tranquilos y relajados para descansar?",
    "¿Qué tanto te interesan los eventos culturales o ferias?",
    "¿Qué tanto prefieren lugares poco conocidos o escondidos?",
    "¿Qué tanto prefieres hacer turismo ecológico o sustentable?",
    "¿Qué tanto te interesa salir con amigos en plan social o casual?",
    "¿Qué tanto prefieren lugares aptos para familias o niños?",
    "¿Qué tanto te interesa comprar artesanías o productos locales?",
    "¿Qué tanto disfrutas de las experiencias románticas o en pareja?",
    "¿Qué tanto te interesan las experiencias fotográficas o paisajísticas?",
    "¿Te interesan lugares para comprar productos de canasta básica?",
    "¿Qué tanto te interesa un lugar para ir a pensar cosas?"
];
const options = ["Nulo", "Leve", "Moderado", "Alto"];

document.addEventListener('DOMContentLoaded', function() {
    const questionsContainer = document.getElementById('questions-container');
    const questionnaireForm = document.getElementById('questionnaire');
    const resultsSection = document.getElementById('results');
    const recommendationDiv = document.getElementById('recommendation');
    const placeDetailsDiv = document.getElementById('place-details');
    const placeImagesDiv = document.getElementById('place-images');
    const restartBtn = document.getElementById('restart-btn');
    const progressBar = document.getElementById('progress-bar');

    // Generar todas las preguntas
    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        
        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `${index + 1}. ${question}`;
        questionDiv.appendChild(questionTitle);
        
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';
        
        options.forEach((option, optionIndex) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.id = `q${index}_opt${optionIndex}`;
            input.name = `question_${index}`;
            input.value = optionIndex + 1; // Valores 1-4 para los radio buttons
            
            const label = document.createElement('label');
            label.htmlFor = `q${index}_opt${optionIndex}`;
            label.textContent = option;
            
            optionDiv.appendChild(input);
            optionDiv.appendChild(label);
            optionsDiv.appendChild(optionDiv);
            
            input.addEventListener('change', updateProgress);
        });
        
        questionDiv.appendChild(optionsDiv);
        questionsContainer.appendChild(questionDiv);
    });
    
    // Actualizar barra de progreso
    function updateProgress() {
        const totalQuestions = questions.length;
        const answeredQuestions = document.querySelectorAll('input[type="radio"]:checked').length;
        const progress = (answeredQuestions / totalQuestions) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
 // Función para mapear los valores de las opciones (ahora con decimales)
function mapOptionValue(optionIndex) {
    switch(optionIndex) {
        case 0: return 0.0;    // Nulo
        case 1: return 0.3;    // Leve
        case 2: return 0.7;    // Moderado
        case 3: return 1.0;    // Alto
        default: return 0.0;   // Por defecto
    }
}
    // Manejar envío del formulario
    questionnaireForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const answers = [];
        let allAnswered = true;
        
        questions.forEach((_, index) => {
            const selectedOption = document.querySelector(`input[name="question_${index}"]:checked`);
            if (selectedOption) {
                answers.push(parseInt(selectedOption.value));
            } else {
                allAnswered = false;
            }
        });
        
        if (!allAnswered) {
            alert('Por favor responde todas las preguntas');
            return;
        }
        
        // Mostrar loader
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        submitBtn.disabled = true;
        
        try {
            const response = await getRecommendation(answers);
            if (response) {
                await showRecommendation(response);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al obtener la recomendación. Por favor intenta nuevamente.');
        } finally {
            submitBtn.innerHTML = '<i class="fas fa-search-location"></i> Encontrar mi lugar';
            submitBtn.disabled = false;
        }
    });
    
    // Obtener recomendación desde la API
    async function getRecommendation(userAnswers) {
        try {
            const requestBody = {
                first: mapOptionValue(userAnswers[0] - 1) || 0,
                second: mapOptionValue(userAnswers[1] - 1) || 0,
                third: mapOptionValue(userAnswers[2] - 1) || 0,
                fourth: mapOptionValue(userAnswers[3] - 1) || 0,
                fifth: mapOptionValue(userAnswers[4] - 1) || 0,
                sixth: mapOptionValue(userAnswers[5] - 1) || 0,
                seventh: mapOptionValue(userAnswers[6] - 1) || 0,
                eighth: mapOptionValue(userAnswers[7] - 1) || 0,
                ninth: mapOptionValue(userAnswers[8] - 1) || 0,
                tenth: mapOptionValue(userAnswers[9] - 1) || 0,
                eleventh: mapOptionValue(userAnswers[10] - 1) || 0,
                twelfth: mapOptionValue(userAnswers[11] - 1) || 0,
                thirteenth: mapOptionValue(userAnswers[12] - 1) || 0,
                fourteenth: mapOptionValue(userAnswers[13] - 1) || 0,
                fifteenth: mapOptionValue(userAnswers[14] - 1) || 0,
                sixteenth: mapOptionValue(userAnswers[15] - 1) || 0,
                seventeenth: mapOptionValue(userAnswers[16] - 1) || 0
            };

            console.log("Enviando a la API:", requestBody);

            const response = await fetch('http://localhost:8000/recommends', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error del servidor:", errorText);
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error completo:', error);
            throw error;
        }
    }
    
async function showRecommendation(apiResponse) {
    try {
        // Verificar si hay lugares recomendados
        if (!apiResponse.recommended_places || apiResponse.recommended_places.length === 0) {
            recommendationDiv.textContent = "Lo sentimos, no hay lugares de acuerdo a tus intereses";
            placeDetailsDiv.innerHTML = '';
            placeImagesDiv.innerHTML = '';
            
            questionnaireForm.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Mostrar título general
        recommendationDiv.textContent = "Lugares recomendados para ti:";
        
        // Limpiar contenedores
        placeDetailsDiv.innerHTML = '';
        placeImagesDiv.innerHTML = '';

        // Crear contenedor para todas las recomendaciones
        const recommendationsContainer = document.createElement('div');
        recommendationsContainer.className = 'recommendations-container';

        // Iterar sobre todos los lugares recomendados
        apiResponse.recommended_places.forEach((place, index) => {
            const placeCard = document.createElement('div');
            placeCard.className = 'place-card';
            
            placeCard.innerHTML = `
                <h3>${index + 1}. ${place.name}</h3>
                <div class="place-content">
                    <img src="${place.urlPhoto || 'https://via.placeholder.com/300x200?text=Imagen+no+disponible'}" 
                         alt="${place.name}" class="place-image">
                    <div class="place-info">
                        <p><strong>Dirección:</strong> ${place.direccion}</p>
                        <p><strong>Puntuación:</strong> ${place.score.toFixed(2)}</p>
                        <a href="${place.urlGoogleMaps}" target="_blank" class="map-link">
                            <i class="fas fa-map-marker-alt"></i> Ver en Google Maps
                        </a>
                    </div>
                </div>
            `;
            
            recommendationsContainer.appendChild(placeCard);
        });

        placeDetailsDiv.appendChild(recommendationsContainer);
        
        // Ocultar formulario y mostrar resultados
        questionnaireForm.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error al mostrar recomendación:', error);
        throw error;
    }
}
    
    // Manejar reinicio
    restartBtn.addEventListener('click', function() {
        document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.checked = false;
        });
        
        progressBar.style.width = '0%';
        
        resultsSection.classList.add('hidden');
        questionnaireForm.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});