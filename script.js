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
            input.value = optionIndex + 1;
            
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
            const recommendation = await getRecommendation(answers);
            if (recommendation) {
                await showRecommendation(recommendation);
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
            first: userAnswers[0] || 0,
            second: userAnswers[1] || 0,
            third: userAnswers[2] || 0,
            fourth: userAnswers[3] || 0,
            fifth: userAnswers[4] || 0,
            sixth: userAnswers[5] || 0,
            seventh: userAnswers[6] || 0,
            eighth: userAnswers[7] || 0,
            ninth: userAnswers[8] || 0,
            tenth: userAnswers[9] || 0,
            eleventh: userAnswers[10] || 0,
            twelfth: userAnswers[11] || 0,
            thirteenth: userAnswers[12] || 0,
            fourteenth: userAnswers[13] || 0,
            fifteenth: userAnswers[14] || 0,
            sixteenth: userAnswers[15] || 0,
            seventeenth: userAnswers[16] || 0
        };

        console.log("Enviando a la API:", requestBody); // Para depuración

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

        const data = await response.json();
        console.log("Respuesta de la API:", data); // Para depuración
        return data.recommendation;
    } catch (error) {
        console.error('Error completo:', error);
        throw error;
    }
}
    
    // Mostrar recomendación con detalles del lugar
    async function showRecommendation(placeName) {
        try {
            recommendationDiv.textContent = placeName;
            
            // Aquí puedes agregar más lógica para mostrar los detalles del lugar
            // basado en lo que devuelva tu API
            
            placeDetailsDiv.innerHTML = `
                <div class="place-info">
                    <p class="place-description">Lugar recomendado: ${placeName}</p>
                    <div class="place-links">
                        <a href="#" target="_blank" class="map-link" id="map-link">
                            <i class="fas fa-map-marker-alt"></i> Ver en Google Maps
                        </a>
                    </div>
                </div>
            `;
            
            // Mostrar imagen por defecto
            placeImagesDiv.innerHTML = '';
            const img = document.createElement('img');
            img.src = 'https://via.placeholder.com/600x400?text=Imagen+de+' + encodeURIComponent(placeName);
            img.alt = placeName;
            img.className = 'main-place-image';
            placeImagesDiv.appendChild(img);
            
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