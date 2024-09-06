interface Book{
    bookId: string;
    genre: string;
    price: number;
    author: string;
    publicationYear: number | string;
    coverImage?: string;
    bookName: string;
}

let bookId = document.getElementById('input-search-id') as HTMLInputElement;
let genre = document.getElementById('input-search-genre') as HTMLInputElement;
let priceMin = document.getElementById('input-search-price-min') as HTMLInputElement;
let priceMax = document.getElementById('input-search-price-max') as HTMLInputElement;
let author = document.getElementById('input-search-author') as HTMLInputElement;
let publicationYear = document.getElementById('input-search-year') as HTMLInputElement;
let similarBook = document.querySelector('.similar-books') as HTMLElement;
let searchBookId = document.getElementById('book-id') as HTMLSpanElement;
let searchPrice = document.getElementById('book-price') as HTMLSpanElement;
let searchGenre = document.getElementById('book-genre') as HTMLSpanElement;
let searchAuthor = document.getElementById('book-author') as HTMLSpanElement;
let searchPublicationYear = document.getElementById('book-year') as HTMLSpanElement;
let examinedThumbnail = document.getElementById('book-coverup') as HTMLImageElement;
let defaultCoverUp = './asset/empty_book.jpeg';
let api_Url = 'https://assignment-test-data-101.s3.ap-south-1.amazonaws.com/books-v2.json';
let arr_data: Book[] = [];
let  similarbook_data: Book[] = [];
let currentPage: number = 1;
let rowsPage: number = 10;
let upper: boolean = true;
let similarTable = document.querySelector('#table-similar-books tbody') as HTMLElement;
let resultIdContainer = document.getElementById('result-id') as HTMLElement;
let resultAuthorContainer = document.getElementById('result-author') as HTMLElement;
let dropDown=document.querySelectorAll<HTMLAnchorElement>('.dropdown-item');

const checkbox = document.getElementById('checkbox') as HTMLElement;
checkbox.addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
});

bookId.addEventListener('input',function(){
    const query:string=bookId.value.toLowerCase();
    const results:Book[]=arr_data.filter((book)=> book.bookId.toLowerCase().includes(query));
    displayResults('result-id',results,'id');
});

author.addEventListener('input', function() {
    const query=author.value.toLowerCase();
    const results = arr_data.filter(book => book.author.toLowerCase().includes(query));
    displayResults('result-author', results, 'author');
});

document.addEventListener('click', function(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.form-cmontrol')) {
        const resultIdElement = document.getElementById('result-id');
        const resultAuthorElement = document.getElementById('result-author');
        if (resultIdElement) {
            resultIdElement.style.display = 'none';
        }
        if (resultAuthorElement) {
            resultAuthorElement.style.display = 'none';
        }
    }
});

author.addEventListener('focus', function() {
    resultIdContainer.style.display = 'none';
});
  
bookId.addEventListener('focus', function() {
    resultAuthorContainer.style.display = 'none';
});


function displayResults(containerId:string,results:Book[],type:string):void{
    let container=document.getElementById(containerId) as HTMLElement;
    container.innerHTML='';
    if(results.length>0){
        results.forEach((book)=>{
            let resultItem=document.createElement('div') as HTMLElement;
            resultItem.classList.add('result-item');
            resultItem.textContent=type==='id'?book.bookId:book.author;
            resultItem.addEventListener('click',function(){
                const inputElement = document.getElementById(`input-search-${type}`) as HTMLInputElement;
                if (inputElement) {
                  inputElement.value = resultItem.textContent as string;
                }
                container.style.display='none';
            })
            container.appendChild(resultItem);
        });
        container.style.display='block';
    }
    else{
        container.style.display='none';
    }
}

function sortingdata(categorytype:string,tabletype:string):void{
    if(tabletype==='similardatatable'){
      if(categorytype==='price'){
        if(upper){
          similarbook_data.sort((a,b)=>a.price-b.price);
        }
        else{
          similarbook_data.sort((a,b)=>b.price-a.price);
        }
      }
      else if(categorytype==='year'){
        if(upper){
          similarbook_data.sort((a,b)=>(a.publicationYear as number)-(b.publicationYear as number));
        }
        else{
          similarbook_data.sort((a,b)=>(b.publicationYear as number)-(a.publicationYear as number));
        }
      }
      upper=!upper;
      similarTable.innerHTML='';
      similarbook_data.slice(0, 10).forEach((book) => {
        let coverbookImage;
        if(book.coverImage){
          coverbookImage=book.coverImage;
        }
        else{
          coverbookImage=defaultCoverUp;
        }
        const rowEntry = document.createElement('tr');
        let imgtd=document.createElement('td');
        let img=document.createElement('img');
        img.src=coverbookImage;
        img.alt=book.bookName;
        img.style.width='50px';
        img.style.height='50px';
        img.style.objectFit='contain';
        imgtd.appendChild(img);
        rowEntry.appendChild(imgtd);
  
        let genretd=document.createElement('td');
        genretd.innerHTML=book.genre;
        rowEntry.appendChild(genretd);
  
        let pricetd=document.createElement('td');
        pricetd.innerHTML=`$ ${book.price}`;
        rowEntry.appendChild(pricetd);
  
        let authorTd=document.createElement('td');
        authorTd.innerHTML=book.author;
        rowEntry.appendChild(authorTd);
  
        let publicyearTd=document.createElement('td');
        publicyearTd.innerHTML=book.publicationYear.toString();
        rowEntry.appendChild(publicyearTd);
  
        let bookNameTd=document.createElement('td');
        bookNameTd.innerHTML=book.bookName;
        rowEntry.appendChild(bookNameTd);
  
        similarTable.appendChild(rowEntry);
      });
    }
    else if(tabletype==='alldatatable'){
      if(categorytype==='price'){
        if(upper){
          arr_data.sort((a,b)=>a.price-b.price);
        }
        else{
          arr_data.sort((a,b)=>b.price-a.price);
        }
      }
      else if(categorytype==='year'){
        if(upper){
          arr_data.sort((a,b)=>(a.publicationYear as number)-(b.publicationYear as number));
        }
        else{
          arr_data.sort((a,b)=>(b.publicationYear as number)-(a.publicationYear as number));
        }
      }
      upper=!upper;
      allbooks();
    }
}

function lazyLoadImages():void{
    let lazyImages=document.querySelectorAll('img.lazy-img');
    if ('IntersectionObserver' in window) {
      const observer=new IntersectionObserver((entries,observer)=>{
        entries.forEach((entry)=>{
          if(entry.isIntersecting){
            let img = entry.target as HTMLImageElement;
            if(img.dataset.src){
              img.src = img.dataset.src;
            }
          }
        });
      },{ 
        root:null,
        rootMargin:'0px',
        threshold:0.8
      });
      lazyImages.forEach(img => observer.observe(img));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('btn-search') as HTMLButtonElement;
    const inputFields = document.querySelectorAll<HTMLInputElement>('input[type="text"]');
    inputFields.forEach(input => {
        input.addEventListener('input', checkInputs);
    });
    function checkInputs(): void {
        let isAnyInputFilled = false;
        for (const input of inputFields) {
            if (input.value.trim() !== '') {
                isAnyInputFilled = true;
                break;
            }
        }
        searchButton.disabled = !isAnyInputFilled;
        if(searchButton.disabled){
            searchButton.classList.add('btn-disabled');
        }
        else{
            searchButton.classList.remove('btn-disabled');
        }

    }
    checkInputs();
});

window.addEventListener("load",()=>{
    const loader=document.querySelector(".loader") as HTMLElement;
    loader.classList.add("loader-hidden");
    loader.addEventListener("transitionend",()=>{
      document.body.removeChild(loader);
    })
})

function similarBooksDetails(similardata:Book):void{  
    let similargenerebooks:Book[]=arr_data.filter((ele) =>
        ele.bookId !== similardata?.bookId &&
        ele.genre.toLowerCase() === similardata?.genre.toLowerCase()
    );
  
    let similarPricedBooks:Book[]=arr_data.filter((book) =>
        book.bookId !== similardata?.bookId &&
        book.price >= similardata?.price * 0.9 &&
        book.price <= similardata?.price * 1.1
    );
  
    let duplicateIds:Set<string>=new Set(
      similargenerebooks
        .filter((book) => similarPricedBooks.some((b) => b?.bookId === book.bookId))
        .map((book) => book.bookId)
    );
  
    let combinedArray:Book[]=[
      ...similargenerebooks.filter((book) => !duplicateIds.has(book.bookId)),
      ...similarPricedBooks.filter((book) => !duplicateIds.has(book.bookId)),
    ];
  
    similarbook_data=[...combinedArray];
    similarTable.innerHTML='';
  
    combinedArray.slice(0, 10).forEach((book) => {
      let coverbookImage;
      if(book.coverImage){
        coverbookImage=book.coverImage;
      }
      else{
        coverbookImage=defaultCoverUp;
      }
      const rowEntry=document.createElement('tr')as HTMLTableRowElement;
      let imgtd=document.createElement('td') as HTMLTableCellElement;
      let img=document.createElement('img') as HTMLImageElement;
      img.alt=book.bookName;
      img.setAttribute('data-src',coverbookImage);
      img.classList.add('lazy-img');
      img.style.width='50px';
      img.style.height='50px';
      img.style.objectFit='contain';
      imgtd.appendChild(img);
      rowEntry.appendChild(imgtd);
  
      let genretd=document.createElement('td') as HTMLTableCellElement;
      genretd.innerHTML=book.genre;
      rowEntry.appendChild(genretd);
  
      let pricetd=document.createElement('td') as HTMLTableCellElement;
      pricetd.innerHTML=`$ ${book.price}`;
      rowEntry.appendChild(pricetd);
  
      let authorTd=document.createElement('td') as HTMLTableCellElement;
      authorTd.innerHTML=book.author;
      rowEntry.appendChild(authorTd);
  
      let publicyearTd=document.createElement('td') as HTMLTableCellElement;
      publicyearTd.innerHTML=book.publicationYear as string;
      rowEntry.appendChild(publicyearTd);
  
      let bookNameTd=document.createElement('td') as HTMLTableCellElement;
      bookNameTd.innerHTML=book.bookName;
      rowEntry.appendChild(bookNameTd);
  
      similarTable.appendChild(rowEntry);
    });
    lazyLoadImages();
}

document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
});

function examinedBookDeatils(filterDatarr:Book[]):void{
    if(filterDatarr.length===0){
        examinedThumbnail.src=defaultCoverUp;
        searchBookId.innerHTML='<b>No Data found!!!!</b>';
        searchPrice.innerHTML='<b>No Data Found!!!!</b>';
        searchGenre.innerHTML='<b>No Data Found!!!!</b>';
        searchAuthor.innerHTML='<b>No Data Found!!!!</b>';
        searchPublicationYear.innerHTML='<b>No Data Found!!!!</b>';
        examinedThumbnail.src=defaultCoverUp;
        similarBook.style.display='none';
    }
    else{
      let ExamineBookData:Book;
      if(!priceMax.value && priceMin.value){
        ExamineBookData=filterDatarr[0];
      }
      else if(!priceMin.value && priceMax.value){
        ExamineBookData=filterDatarr[filterDatarr.length-1];
      }
      else{
        ExamineBookData=filterDatarr[0];
      }
      console.log('Data for bookedExamine',ExamineBookData);
      let coverImage;
      if(ExamineBookData.coverImage){
        coverImage=ExamineBookData.coverImage;
      }
      else{
        coverImage=defaultCoverUp;
      }
      searchBookId.innerHTML = `<b>${ExamineBookData?.bookId}</b>`;
      searchPrice.innerHTML = `<b>$ ${ExamineBookData?.price}</b>`;
      searchGenre.innerHTML = `<b>${ExamineBookData?.genre}</b>`;
      searchAuthor.innerHTML = `<b>${ExamineBookData?.author}</b>`;
      searchPublicationYear.innerHTML = `<b>${ExamineBookData?.publicationYear}</b>`;
      examinedThumbnail.src = coverImage;
      examinedThumbnail.style.display = 'block';
    }
    similarBooksDetails(filterDatarr[0]);
}

function filterData(val:string|number,filterType:string,currentData:Book[]):Book[]{
    const lowerVal= typeof val==='string'?val.toLowerCase():val;
    const getExactMatches=(key: keyof Book)=>currentData.filter((book)=>{
        return typeof book[key] === 'string' && book[key].toLowerCase() === lowerVal;
    });
    const getStartsWithMatches=(key:keyof Book)=>currentData.filter((book)=>{
        return typeof book[key]==='string'&& book[key].toLowerCase().startsWith(lowerVal as string);
    });
    const includesMatches=(key: keyof Book)=>currentData.filter((book)=>{
        return typeof book[key]==='string' && book[key].toLowerCase().includes(lowerVal as string);
    }); 

    if(filterType === 'bookId') {
      const exactMatches:Book[]=getExactMatches('bookId');
      if (exactMatches.length > 0) {
        console.log("aakki1", exactMatches);
        return exactMatches;
      }
      const startsWithMatches:Book[]=getStartsWithMatches('bookId');
      if (startsWithMatches.length > 0) {
        return startsWithMatches;
      }
      const includesMatchesdata:Book[]=includesMatches('bookId');
      if (includesMatchesdata.length > 0) {
        return includesMatchesdata;
      }
    }
    else if (filterType === 'genre') {
      const exactMatches:Book[]=getExactMatches('genre');
      if (exactMatches.length>0){
        console.log("aakki2", exactMatches);
        return exactMatches;
      }
      const startsWithMatches:Book[]=getStartsWithMatches('genre');
      if (startsWithMatches.length > 0) {
        return startsWithMatches;
      }
    }
    else if (filterType==='priceMin'){
        let pricemin:Book[]=currentData.filter((book)=>book.price>=(val as number));
        console.log("price-Min",pricemin);
        return pricemin; 
    }
    else if (filterType==='priceMax'){
        let pricemax:Book[]=currentData.filter((book) => book.price <= (val as number));
        console.log("price-Max",pricemax);
        return pricemax;
    }
    else if (filterType === 'author') {
      const exactMatches = getExactMatches('author');
      if (exactMatches.length > 0) {
        console.log("aakki3", exactMatches);
        return exactMatches;
      }
      const startsWithMatches = getStartsWithMatches('author');
      if (startsWithMatches.length > 0) {
        console.log("aakki3",startsWithMatches);
        return startsWithMatches;
      }
      const includesMatchesdata=includesMatches('author');
      if (includesMatchesdata.length > 0) {
        return includesMatchesdata;
      }
    } 
    else if (filterType === 'publicationYear') {
      let publicyear=currentData.filter((book) => book.publicationYear.toString() === val);
      console.log("Year",publicyear);
      return publicyear;
    }
    return [];
};

function handleSearch():void{
    let filteredData:Book[] = arr_data;
  
    const filters=[
      { value: bookId.value, type: 'bookId' },
      { value: genre.value, type: 'genre' },
      { value: priceMin.value, type: 'priceMin' },
      { value: priceMax.value, type: 'priceMax' },
      { value: author.value, type: 'author' },
      { value: publicationYear.value, type: 'publicationYear' },
    ];
  
    filteredData = filters.reduce((acc, filter) => {
      return filter.value ? filterData(filter.value, filter.type, acc) : acc;
    }, filteredData);
  
    const isFiltered = filters.some(filter => filter.value);
  
    if(isFiltered){
      filteredData.sort((a, b) => a.price - b.price);
      similarBook.style.display = 'block';
      console.log('Lit of data',filteredData);
      examinedBookDeatils(filteredData);
    }
    else {
      examinedBookDeatils([]);
    }   
}

function paginateData(page:number):Book[]{
    const start:number=(page-1)*rowsPage;
    const end:number=start+rowsPage;
    return arr_data.slice(start, end);
};

function renderPagination(totalPages:number):void {
    const paginationElement = document.querySelector('.pagination') as HTMLUListElement;
    paginationElement.innerHTML = '';

    const createPageItem=(page:number, text:string|number) => {
      const li=document.createElement('li');
      li.classList.add('page-item');
      li.innerHTML = `<a class="page-link" href="#">${text}</a>`;
      if (page === currentPage) {
        li.classList.add('active');
      }
      li.addEventListener('click', (event) => {
        event.preventDefault();
        if (page >= 1 && page <= totalPages) {
          currentPage = page;
          const tableBody = document.querySelector<HTMLTableSectionElement>('#table-all-books tbody');
            if (tableBody) {
                tableBody.innerHTML = '';
            }
          allbooks();
        }
      });
      return li;
    };
  
    const maxVisiblePages:number=3;
    let startPage:number = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage:number = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
  
    paginationElement.appendChild(createPageItem(currentPage - 1, 'Prev'));
  
    for (let i = startPage; i <= endPage; i += 1) {
      paginationElement.appendChild(createPageItem(i, i));
    }
  
    paginationElement.appendChild(createPageItem(currentPage + 1, 'Next'));
}  

function allbooks(): void {
    const bookstable = document.querySelector('#table-all-books tbody') as HTMLElement;
    bookstable.innerHTML = '';

    let tableData = paginateData(currentPage);
    tableData.forEach((ele) => {
      let bookImage: string;
      console.log(ele.coverImage);
      
      if (ele.coverImage) {
        bookImage = ele.coverImage;
      }
      else {
        bookImage=defaultCoverUp;
      }
  
      const newrow = document.createElement('tr');
      const imgTd = document.createElement('td');
      const img = document.createElement('img');
      img.alt = ele.bookName;
      img.setAttribute('data-src', bookImage);
      img.classList.add('lazy-img');
      img.style.width = '50px';
      img.style.height = '50px';
      img.style.objectFit = 'contain';
      imgTd.appendChild(img);
  
      const nameTd = document.createElement('td');
      nameTd.textContent = ele.bookName;
  
      const priceTd = document.createElement('td');
      priceTd.textContent = `$ ${ele.price}`;
  
      const genreTd = document.createElement('td');
      genreTd.textContent = ele.genre;
  
      const yearTd = document.createElement('td');
      yearTd.textContent = ele.publicationYear.toString();
  
      const authorTd = document.createElement('td');
      authorTd.textContent = ele.author;
  
      newrow.appendChild(imgTd);
      newrow.appendChild(nameTd);
      newrow.appendChild(priceTd);
      newrow.appendChild(genreTd);
      newrow.appendChild(yearTd);
      newrow.appendChild(authorTd);
      bookstable.appendChild(newrow);
    });
    lazyLoadImages();
    const totalPages = Math.ceil(arr_data.length / rowsPage);
    renderPagination(totalPages);
}

dropDown.forEach((item) => {
    item.addEventListener('click', function(event:MouseEvent) {
        event.preventDefault();
        const selectedValue = item.getAttribute('data-value') as string;
        rowsPage = parseInt(selectedValue, 10);
        currentPage = 1;
        allbooks();
        console.log('Selected Value:', selectedValue);
    });
});
   
function dataBook():Promise<Book[] | null>{
  const localData=localStorage.getItem('Data');
  if(localData){
    const data=JSON.parse(localData);
    arr_data=data;
    return Promise.resolve(data);
  }
  return fetch(api_Url)
    .then((res)=>{
        if(!res.ok){
            throw new Error('Network respnse not work!!!!');
        }
        return res.json();
    })
    .then((ele)=>{
        localStorage.setItem('Data',JSON.stringify(ele));
        arr_data=ele;
        return ele;
    })
    .catch((err)=>{
        console.error("Error in fetching Book Data",err);
        return null;
    });
}

dataBook().then((ele:Book[] | null)=>{
    console.log("Aakash",ele);
}).then(allbooks);