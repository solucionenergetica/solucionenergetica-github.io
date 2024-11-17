        //modulos
        let total = 0;
        let selectedModules = [];

        function toggleSelection(element) {
            const price = parseInt(element.querySelector('p').textContent.match(/\$([0-9]+)/)[1]);
            const item = element.querySelector('strong').textContent;

            if (element.style.borderColor === 'green') {
                element.style.borderColor = '#ddd';
                updatePrice(-price);
                selectedModules = selectedModules.filter(module => module !== item);
            } else {
                element.style.borderColor = 'green';
                updatePrice(price);
                selectedModules.push(item);
            }
        }

        function updatePrice(amount) {
            total += amount;
            document.getElementById('totalPrice').textContent = '$' + total;
        }

        function showPhoneModal() {
            document.getElementById('phoneModal').style.display = 'block';
        }

        function closePhoneModal() {
            document.getElementById('phoneModal').style.display = 'none';
        }

        function sendData() {
            const phoneNumber = document.getElementById('phoneNumber').value;
            const emailBody = `
                Número de Teléfono: ${phoneNumber}
                Módulos seleccionados: ${selectedModules.join(', ')}
                Total: $${total}
            `;
            
            window.location.href = `mailto:espoleta.tech@gmail.com?subject=Compra de Módulos Solares&body=${encodeURIComponent(emailBody)}`;
        }

        function showRecommendation(totalPower, totalEnergy) {
            const hsp = 5; // Horas de sol pico promedio
            const panelPower = 300; // Potencia de cada panel solar (W)
            const batteryCapacity = 110; // Capacidad de cada batería (Ah)
            const systemVoltage = 72; // Voltaje del sistema acorde al inversor
            const inverterEfficiency = 0.9; // Eficiencia del inversor (90%)
            const dod = 0.5; // Profundidad de descarga segura (50%)
        
            // Ajuste por eficiencia del inversor
            const adjustedEnergy = totalEnergy / inverterEfficiency;
        
            // Calcular capacidad de baterías necesarias
            const batteryEnergyNeeded = adjustedEnergy / (systemVoltage * dod);
            const batteriesNeeded = Math.ceil(batteryEnergyNeeded / batteryCapacity);
        
            // Calcular cantidad de paneles solares
            const panelsNeeded = Math.ceil(adjustedEnergy / (panelPower * hsp));
        
            const suggestionsDiv = document.getElementById('usageDetails');
        
            suggestionsDiv.innerHTML = `
                <h3>Recomendación de Sistema Solar</h3>
                <p>Basado en tu consumo, con un inversor de 72V y 2600W:</p>
                <ul>
                    <li><strong>${panelsNeeded} Panel(es) Solar(es) de 300W</strong></li>
                    <li><strong>${batteriesNeeded} Batería(s) de 110 Ah configuradas en serie para 72V</strong></li>
                </ul>
                <p>Este sistema cubrirá un consumo diario de <strong>${totalEnergy.toFixed(2)} Wh</strong>, asegurando autonomía nocturna y eficiencia del sistema.</p>
            `;
        }

        //emergenci

        let devices = [];
    
        function addDeviceForm() {
            const deviceSelect = document.getElementById('deviceSelect');
            const selectedOption = deviceSelect.options[deviceSelect.selectedIndex];
            const selectedDevice = selectedOption.value;
    
            if (!selectedDevice) {
                alert('Por favor selecciona un dispositivo.');
                return;
            }
    
            // Comprobar si el dispositivo ya está en la lista
            if (devices.some(device => device.name === selectedDevice)) {
                alert(`El dispositivo "${selectedDevice}" ya ha sido agregado.`);
                return;
            }
    
            const defaultPower = selectedOption.getAttribute('data-power');
            const deviceId = `device-${devices.length}`;
            devices.push({ id: deviceId, name: selectedDevice });
    
            const formContainer = document.createElement('div');
            formContainer.className = 'device-form';
            formContainer.id = deviceId;
    
            formContainer.innerHTML = `
                <h4>${selectedDevice}</h4>
                <div>
                    <label for="power-${deviceId}">Potencia (W)</label>
                    <input type="number" id="power-${deviceId}" value="${defaultPower}" readonly>
                </div>
                <div>
                    <label for="hours-${deviceId}">Horas de uso diario</label>
                    <input type="number" id="hours-${deviceId}" placeholder="Horas" min="0">
                </div>
                <div>
                    <label for="quantity-${deviceId}">Cantidad de equipos</label>
                    <input type="number" id="quantity-${deviceId}" placeholder="Cantidad" min="1" value="1">
                </div>
                <button type="button" onclick="removeDeviceForm('${deviceId}')">Eliminar</button>
            `;
    
            document.getElementById('deviceForms').appendChild(formContainer);
    
            // Escuchar cambios en los campos para recalcular automáticamente
            document.getElementById(`hours-${deviceId}`).addEventListener('input', calculateTotal);
            document.getElementById(`quantity-${deviceId}`).addEventListener('input', calculateTotal);
    
            deviceSelect.value = ''; // Reset dropdown
            calculateTotal();
        }
    
        function removeDeviceForm(deviceId) {
            const formElement = document.getElementById(deviceId);
            formElement.remove();
            devices = devices.filter(d => d.id !== deviceId);
            calculateTotal();
        }
    
        function calculateTotal() {
            let totalPower = 0;
            let totalEnergy = 0;
    
            devices.forEach(d => {
                const power = document.getElementById(`power-${d.id}`).value;
                const hours = document.getElementById(`hours-${d.id}`).value || 0;
                const quantity = document.getElementById(`quantity-${d.id}`).value || 1;
                totalPower += (power * quantity);
                totalEnergy += (power * hours * quantity);
            });
    
            displayResults(totalPower, totalEnergy);
        }
    
        function displayResults(totalPower, totalEnergy) {
            const resultDiv = document.getElementById('result');
            const totalPowerFormatted = totalPower.toFixed(2);
            const totalEnergyFormatted = totalEnergy.toFixed(2);
    
            if (totalPower > 0) {
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <h3>Resultados</h3>
                    <p><strong>Potencia Total Requerida:</strong> ${totalPowerFormatted} W</p>
                    <p><strong>Consumo Diario Total:</strong> ${totalEnergyFormatted} Wh</p>
                `;
            } else {
                resultDiv.style.display = 'none';
            }
    
            showRecommendation(totalPower);
        }
    
        function showRecommendation(totalPower) {
            const suggestionsDiv = document.getElementById('recommendations');
            let suggestionsHtml = `<h3>Recomendación de Módulo</h3>`;
    
            suggestionsHtml += `<button id="recommendationBtn" onclick="window.location.href='modulo_solar.html'">Ver Módulo</button>`;
            suggestionsDiv.innerHTML = suggestionsHtml;
            suggestionsDiv.style.display = 'block';
        }