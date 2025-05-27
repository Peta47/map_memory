let map = L.map('map').setView([50.0755, 14.4378], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let currentLatLng = null;

map.on('click', function (e) {
  currentLatLng = e.latlng;
  document.getElementById('modal').classList.remove('hidden');
});

document.getElementById('savePoint').onclick = function () {
  const note = document.getElementById('note').value;
  const photoInput = document.getElementById('photo');
  const file = photoInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      const imageData = reader.result;
      savePoint({ latlng: currentLatLng, note, imageData });
    };
    reader.readAsDataURL(file);
  } else {
    savePoint({ latlng: currentLatLng, note, imageData: null });
  }

  document.getElementById('modal').classList.add('hidden');
  document.getElementById('note').value = '';
  photoInput.value = '';
};

function savePoint(point) {
  addMarker(point);
  saveToDB(point);
}

function addMarker(point) {
  const marker = L.marker(point.latlng).addTo(map);
  let popupContent = `<p>${point.note}</p>`;
  if (point.imageData) {
    popupContent += `<img src="${point.imageData}" width="100">`;
  }
  marker.bindPopup(popupContent);
}

function saveToDB(point) {
  if (!window.localStorage) return;
  let points = JSON.parse(localStorage.getItem('points') || '[]');
  points.push(point);
  localStorage.setItem('points', JSON.stringify(points));
}

function loadFromDB() {
  let points = JSON.parse(localStorage.getItem('points') || '[]');
  points.forEach(addMarker);
}

loadFromDB();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}