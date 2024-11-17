        //modulos
        let total = 0;
        let selectedModules = [];
        // let total = 0;
        let totalPower = 0;
        let totalEnergyyy = 0;
        let cantpaneles = 0;
        let cantbaterias = 0;
        // let selectedModules = [];
        // Costos unitarios de los módulos
        const panelCost = 200;    // Costo de un panel solar
        const batteryCost = 75;   // Costo de una batería
        const inverterCost = 250; // Costo de un inversor


        function toggleSelection(element) {
            // const price = parseInt(element.querySelector('p').textContent.match(/\$([0-9]+)/)[1]);
            const price = parseInt(element.querySelector('p').getAttribute('data-price'));
            const item = element.querySelector('strong').textContent.toLowerCase();
            let quantity = 1; // Valor por defecto
            
            // Determinar la cantidad según el tipo de componente
            if (item.includes('panel solar')) {
                quantity = cantpaneles || 1; 
            } else if (item.includes('batería')) {
                quantity = cantbaterias || 1; 
            }
        
            if (element.style.borderColor === 'green') {
                // Deseleccionar elemento
                element.style.borderColor = '#ddd';
                updatePrice(-price * quantity);
                selectedModules = selectedModules.filter(module => module !== item);
            } else {
                // Seleccionar elemento
                element.style.borderColor = 'green';
                updatePrice(price * quantity);
                selectedModules.push(item);
            }
        }
        

        window.onload = function() {
            const storedTotalPower = localStorage.getItem('totalPower');
            const storedTotalEnergyyy = localStorage.getItem('totalEnergyyy');
        
            if (storedTotalPower && storedTotalEnergyyy) {
                // Usamos los valores almacenados para continuar con la recomendación
                showRecommendationr(storedTotalEnergyyy);
                // updateModuleDisplay(storedTotalPower, storedTotalEnergyyy);
            }
        };
        

        function updatePrice(amount) {
            total += amount;
            document.getElementById('totalPrice').textContent = '$' + total*320 + ' CUP';
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
            // totalEnergyyy = totalEnergyFormatted;

            // Guardamos los resultados en localStorage
            localStorage.setItem('totalPower', totalPowerFormatted);
            localStorage.setItem('totalEnergyyy', totalEnergyFormatted);

    
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
            // Llamamos a showRecommendationr después de obtener el totalEnergyyy
            showRecommendationr(totalEnergyFormatted);
        }
    
        function showRecommendation(totalPower) {
            const suggestionsDiv = document.getElementById('recommendations');
            let suggestionsHtml = `<h3>Recomendación de Módulo</h3>`;
    
            suggestionsHtml += `<button id="recommendationBtn" onclick="window.location.href='modulo_solar.html'">Ver Módulo</button>`;
            suggestionsDiv.innerHTML = suggestionsHtml;
            suggestionsDiv.style.display = 'block';
        }
        function showRecommendationr() {
            // Recuperar valores de localStorage y asegurarse de que sean numéricos
            const storedTotalEnergyyy = parseFloat(localStorage.getItem('totalEnergyyy'));
            const storedTotalPower = parseFloat(localStorage.getItem('totalPower'));
        
            if (!isNaN(storedTotalEnergyyy) && !isNaN(storedTotalPower)) {
                // Hacemos los cálculos con los valores guardados
                const hsp = 4.5; // Horas de sol pico promedio
                const panelPower = 300; // Potencia de cada panel solar (W)
                const batteryCapacity = 110; // Capacidad de cada batería (Ah)
                const systemVoltage = 72; // Voltaje del sistema acorde al inversor
                const inverterEfficiency = 0.9; // Eficiencia del inversor (90%)
                const dod = 0.5; // Profundidad de descarga segura (50%)
        
                // Ajuste por eficiencia del inversor
                const adjustedEnergy = storedTotalEnergyyy / inverterEfficiency;
        
                // Calcular cantidad de paneles solares
                const panelsNeeded = Math.ceil(adjustedEnergy / (panelPower * hsp));
        
                // Calcular capacidad de baterías necesarias
                const batteryEnergyNeeded = adjustedEnergy / (systemVoltage * dod);
                const batteriesNeeded = Math.ceil(batteryEnergyNeeded / batteryCapacity);
        
                // Cálculo dinámico de inversores según la potencia total requerida
                const inverterPower = 2600; // Potencia del inversor (W)
                const invertersNeeded = Math.ceil(storedTotalPower / inverterPower); // Se calcula según la potencia total
                cantbaterias = batteriesNeeded;
                cantpaneles = panelsNeeded;

        
                // Verificar que el cálculo de inversores tiene sentido
                console.log(`Potencia Total: ${storedTotalPower} W`);
                console.log(`Inversores necesarios (redondeado): ${invertersNeeded}`);
        
                // Mostrar los resultados
                console.log(`Cantidad recomendada de paneles solares: ${panelsNeeded}`);
                console.log(`Cantidad recomendada de baterías: ${batteriesNeeded}`);
                console.log(`Cantidad recomendada de inversores: ${invertersNeeded}`);

                // Actualizar la cantidad de paneles solares
                const panelElement = document.querySelector('div.module-item img[alt="Panel Solar"] + div p');
                if (panelElement) {
                    console.log('Actualizando panel solar');
                    panelElement.innerHTML = `300W (Cantidad : ${panelsNeeded} unidades)`;
                } else {
                    console.log('Elemento de panel solar no encontrado');
                }
            
                // Actualizar la cantidad de baterías
                const batteryElement = document.querySelector('div.module-item img[alt="Batería"] + div p');
                if (batteryElement) {
                    console.log('Actualizando batería');
                    batteryElement.innerHTML = `110Ah (Cantidad : ${batteriesNeeded} unidades)`;
                } else {
                    console.log('Elemento de batería no encontrado');
                }   
        
                // Actualizar la UI con las cantidades recomendadas
                // updateModuleDisplay(panelsNeeded, batteriesNeeded, invertersNeeded);
            } else {
                console.log("No se encontraron valores de energía o potencia en el localStorage.");
            }
        }
        
        
        
        

        
        
        // function updateModuleDisplay(panelsNeeded, batteriesNeeded, invertersNeeded) {
        //     const storedTotalEnergyyy = localStorage.getItem('totalEnergyyy');
        //     let panel = Math.ceil(panelsNeeded);
        //     let bat = Math.ceil(batteriesNeeded);
        //     // let panel = Math.ceil(panelsNeeded);
        //     // Verificamos y mostramos en consola los valores que estamos pasando a la función
        //     console.log(`w total: ${storedTotalEnergyyy}`);
        //     console.log(`Cantidad recomendada de paneles solares: ${panel}`);
        //     console.log(`Cantidad recomendada de baterías: ${bat}`);
        //     console.log(`Cantidad recomendada de inversores: ${invertersNeeded}`);
        
        //     // Actualizar la cantidad de paneles solares
        //     const panelElement = document.querySelector('div.module-item img[alt="Panel Solar"] + div p');
        //     if (panelElement) {
        //         console.log('Actualizando panel solar');
        //         panelElement.innerHTML = `300W - $200 por unidad (Cantidad recomendada: ${panel})`;
        //     } else {
        //         console.log('Elemento de panel solar no encontrado');
        //     }
        
        //     // Actualizar la cantidad de baterías
        //     const batteryElement = document.querySelector('div.module-item img[alt="Batería"] + div p');
        //     if (batteryElement) {
        //         console.log('Actualizando batería');
        //         batteryElement.innerHTML = `110Ah - $75 por unidad (Cantidad recomendada: ${bat})`;
        //     } else {
        //         console.log('Elemento de batería no encontrado');
        //     }
        
        //     // Actualizar la cantidad de inversores
        //     // const inverterElement = document.querySelector('div.module-item img[alt="Inversor"] + div p');
        //     // if (inverterElement) {
        //     //     console.log('Actualizando inversor');
        //     //     inverterElement.innerHTML = `2600W - $200 (Cantidad recomendada: ${invertersNeeded})`;
        //     // } else {
        //     //     console.log('Elemento de inversor no encontrado');
        //     // }
        // }
        
        
        


        function clearData() {
            localStorage.removeItem('totalPower');
            localStorage.removeItem('totalEnergyyy');
        }