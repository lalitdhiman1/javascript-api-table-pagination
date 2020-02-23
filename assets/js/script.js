var $data = [];
var currentPage = 1;
var recordsPerPage = 5;
let getData = new Promise((resolve, reject) => {
  resolve(
    fetch("/assets/data/data.json")
      .then(res => res.json())
      .then(data => data._embedded.episodes)
  );
});

getData.then(data => {
  $data = data;
  changePage(1);
});

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    changePage(currentPage);
  }
}

function nextPage() {
  if (currentPage < numPages()) {
    currentPage++;
    changePage(currentPage);
  }
}

function changePage(page) {
  var table = document.createElement("table");
  table.setAttribute("class", "table");
  var col = [];

  var btn_next = document.getElementById("btn_next");
  var btn_prev = document.getElementById("btn_prev");
  var listing_table = document.getElementById("listingTable");
  var page_span = document.getElementById("page");

  // Validate page
  if (page < 1) page = 1;
  if (page > numPages()) page = numPages();

  listing_table.innerHTML = "";

  for (var i = 0; i < $data.length; i++) {
    for (var key in $data[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }

  var tr = table.insertRow(-1);

  for (var i = 0; i < col.length; i++) {
    var th = document.createElement("th");
    th.innerHTML = col[i] + `<span class="filter ${col[i]}"><i class="fa fa-chevron-down" aria-hidden="true"></i></span>`;
    tr.appendChild(th);
  }
  for (
    var i = (page - 1) * recordsPerPage;
    i < page * recordsPerPage;
    i++
  ) {
    var innerData = $data[i];
    var tr = table.insertRow(-1);

    for (let item in innerData) {
      var tabCell = tr.insertCell(-1);
      if (item == "_links") {
        tabCell.innerHTML = $data[i][item].self.href;
      } else if (item == "image") {
        tabCell.innerHTML = `<img src='${$data[i][item].medium}' />`;
      } else {
        tabCell.innerHTML = $data[i][item];
      }
    }
  }

  page_span.innerHTML = page;

  if (page == 1) {
    btn_prev.classList.add("hidden");
    btn_prev.classList.remove("visible");
  } else {
    btn_prev.classList.add("visible");
    btn_prev.classList.remove("hidden");
  }

  if (page == numPages()) {
    btn_next.classList.add("hidden");
    btn_next.classList.remove("visible");
  } else {
    btn_next.classList.add("visible");
    btn_next.classList.remove("hidden");
  }
  var divContainer = document.getElementById("listingTable");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);

  var el = document.querySelectorAll('.filter');
  for(var i=0; i < el.length; i++){
    el[i].addEventListener('click', function () {
        var filterName = this.classList[1];
        var newArr = [];
        var getdata = $data.map(item=>{
            newArr.push(item[filterName])
        })
        let unique = newArr.filter((item, i, ar) => ar.indexOf(item) === i);
        console.log(unique);
        var divElement = document.createElement('div');
        divElement.classList="popUp";
        const createPop = unique.map(item=>{
            return `<div>${item}</div>`
        })
        divElement.innerHTML = createPop;           
        this.appendChild(divElement)
    }, false);
} 

} 

function numPages() {
  return Math.ceil($data.length / recordsPerPage);
}

 