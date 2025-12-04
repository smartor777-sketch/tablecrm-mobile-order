const token = 'af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77';
const url = `https://app.tablecrm.com/api/v1/contragents?token=${token}`;

console.log('Запрос к API...');
console.log('URL:', url);
console.log('');

try {
  const response = await fetch(url);
  console.log('Status:', response.status, response.statusText);
  console.log('Headers:', Object.fromEntries(response.headers.entries()));
  console.log('');

  const text = await response.text();
  console.log('Response length:', text.length);
  console.log('Response (first 1000 chars):', text.substring(0, 1000));
  console.log('');

  if (text.trim()) {
    try {
      const data = JSON.parse(text);
      console.log('Parsed JSON successfully!');
      console.log('Type:', Array.isArray(data) ? 'Array' : typeof data);
      
      if (Array.isArray(data)) {
        console.log('Total clients:', data.length);
        console.log('');
        
        const clientsWithPhone = data.filter(c => c.phone);
        console.log('Clients with phone:', clientsWithPhone.length);
        console.log('');
        
        if (clientsWithPhone.length > 0) {
          console.log('Примеры клиентов с телефонами:');
          console.log('================================');
          clientsWithPhone.slice(0, 5).forEach((client, i) => {
            console.log(`\n${i + 1}. ${client.name || 'Без имени'} (ID: ${client.id})`);
            console.log(`   Телефон: ${client.phone}`);
            if (client.email) console.log(`   Email: ${client.email}`);
          });
        } else {
          console.log('Клиенты с телефонами не найдены.');
          console.log('\nПервые 3 клиента:');
          data.slice(0, 3).forEach((client, i) => {
            console.log(`\n${i + 1}. ${JSON.stringify(client, null, 2)}`);
          });
        }
      } else {
        console.log('Данные:', JSON.stringify(data, null, 2).substring(0, 2000));
      }
    } catch (e) {
      console.error('Ошибка парсинга JSON:', e.message);
    }
  } else {
    console.log('Ответ пустой');
  }
} catch (error) {
  console.error('Ошибка запроса:', error.message);
  console.error(error.stack);
}

