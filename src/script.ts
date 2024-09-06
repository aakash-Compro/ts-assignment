interface Book{
    bookId: string;
    genre: string;
    price: number;
    author: string;
    publicationYear: number | string;
    coverImage?: string;
    bookName: string;
}

const bookId = document.getElementById('input-search-id') as HTMLInputElement;
const genre = document.getElementById('input-search-genre') as HTMLInputElement;
const priceMin = document.getElementById('input-search-price-min') as HTMLInputElement;
const priceMax = document.getElementById('input-search-price-max') as HTMLInputElement;
const author = document.getElementById('input-search-author') as HTMLInputElement;
const publicationYear = document.getElementById('input-search-year') as HTMLInputElement;
const similarBook = document.querySelector('.similar-books') as HTMLElement;
const searchBookId = document.getElementById('book-id') as HTMLSpanElement;
const searchPrice = document.getElementById('book-price') as HTMLSpanElement;
const searchGenre = document.getElementById('book-genre') as HTMLSpanElement;
const searchAuthor = document.getElementById('book-author') as HTMLSpanElement;
const searchPublicationYear = document.getElementById('book-year') as HTMLSpanElement;
const examinedThumbnail = document.getElementById('book-coverup') as HTMLImageElement;
let defaultCoverUp = './asset/empty_book.jpeg';
const api_Url = 'https://assignment-test-data-101.s3.ap-south-1.amazonaws.com/books-v2.json';
let total_book_arr: Book[] = [];
let  similarbook_data: Book[] = [];
let currentPage: number = 1;
let rowsPage: number = 10;
let upper: boolean = true;
const similarTable = document.querySelector('#table-similar-books tbody') as HTMLElement;
const resultIdContainer = document.getElementById('result-id') as HTMLElement;
const resultAuthorContainer = document.getElementById('result-author') as HTMLElement;
const dropDown=document.querySelectorAll<HTMLAnchorElement>('.dropdown-item');

const checkbox = document.getElementById('checkbox') as HTMLElement;

/** 
Handler: Change event
Functionality: Toggles the 'dark-mode' class on the document body to switch between dark and light modes.
*/
checkbox.addEventListener('change', function() {
  document.body.classList.toggle('dark-mode');
});

/**
Handler: Input event
Functionality: Filters the total book array based on the book ID input value and displays the matching results in the 'result-id' container.
*/
bookId.addEventListener('input', function() {
  const query: string = bookId.value.toLowerCase();
  const results: Book[] = total_book_arr.filter((book) => book.bookId.toLowerCase().includes(query));
  displayResults('result-id', results, 'id');
});

/**
Handler: Input event
Functionality: Filters the total book array based on the author input value and displays the matching results in the 'result-author' container.
*/
author.addEventListener('input', function() {
  const query = author.value.toLowerCase();
  const results = total_book_arr.filter(book => book.author.toLowerCase().includes(query));
  displayResults('result-author', results, 'author');
});

/** 
Handler: Click event
Functionality: Hides the result containers for book ID and author if a click is detected outside of the form controls.
*/
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

/**
Handler: Focus event
Functionality: Hides the book ID result container when the author input field receives focus.
*/
author.addEventListener('focus', function() {
  resultIdContainer.style.display = 'none';
});

/**
Handler: Focus event
Functionality: Hides the author result container when the book ID input field receives focus.
*/
bookId.addEventListener('focus', function() {
  resultAuthorContainer.style.display = 'none';
});


/**
 * Displays search results in a specified container.
 * This function clears the container, then populates it with result items based on the provided type.
 * Each result item is clickable, and clicking it will set the value of the associated input field 
 * to the item's text content, and hide the container.
 */
function displayResults(containerId:string ,results:Book[] ,type:string ):void {
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

/**
 * Sorts and updates the data displayed in tables based on the selected category and sort order.
 * 
 * categorytype - The category to sort by, either 'price' or 'year'.
 * tabletype - The type of table to update, either 'similardatatable' or 'alldatatable'.
 * 
 * This function sorts the `similarbook_data` or `total_book_arr` arrays based on the specified category 
 * and sort order (ascending or descending). It then updates the corresponding table by clearing the 
 * current contents and appending the sorted data. The `upper` flag toggles the sort order between 
 * ascending and descending.
 */
function sortingdata(categorytype:string,tabletype:string):void {
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
          total_book_arr.sort((a,b)=>a.price-b.price);
        }
        else{
          total_book_arr.sort((a,b)=>b.price-a.price);
        }
      }
      else if(categorytype==='year'){
        if(upper){
          total_book_arr.sort((a,b)=>(a.publicationYear as number)-(b.publicationYear as number));
        }
        else{
          total_book_arr.sort((a,b)=>(b.publicationYear as number)-(a.publicationYear as number));
        }
      }
      upper=!upper;
      allbooks();
    }
}

/**
 * Implements lazy loading for images with the class 'lazy-img' using the IntersectionObserver API.
 * Images are loaded when they come into view (based on threshold).
 * Updates the image's `src` attribute from `data-src` when the image is intersecting.
 */
function lazyLoadImages():void {
    let lazyImages=document.querySelectorAll('img.lazy-img');
    if ('IntersectionObserver' in window) {
      const observer=new IntersectionObserver((entries)=>{
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

window.addEventListener("load",function() {
    const loader=document.querySelector(".loader") as HTMLElement;
    loader.classList.add("loader-hidden");
    loader.addEventListener("transitionend",()=>{
      document.body.removeChild(loader);
    })
})

/**
 * Finds books similar to the given book based on genre and price range and return array of similar Book.
 */
function findSimilarBooks(similardata: Book): Book[] {
  let similargenerebooks: Book[] = total_book_arr.filter((ele) =>
      ele.bookId !== similardata?.bookId &&
      ele.genre.toLowerCase() === similardata?.genre.toLowerCase()
  );

  let similarPricedBooks: Book[] = total_book_arr.filter((book) =>
      book.bookId !== similardata?.bookId &&
      book.price >= similardata?.price * 0.9 &&
      book.price <= similardata?.price * 1.1
  );

  let duplicateIds: Set<string> = new Set(
      similargenerebooks
          .filter((book) => similarPricedBooks.some((b) => b?.bookId === book.bookId))
          .map((book) => book.bookId)
  );

  let combinedArray: Book[] = [
      ...similargenerebooks.filter((book) => !duplicateIds.has(book.bookId)),
      ...similarPricedBooks.filter((book) => !duplicateIds.has(book.bookId)),
  ];

  return combinedArray;
}

/**
 * Displays details of books similar to the given book in a table format.
 */
function similarBooksDetails(similardata: Book): void {
  const combinedArray: Book[] = findSimilarBooks(similardata);

  similarbook_data = [...combinedArray];
  similarTable.innerHTML = '';

  combinedArray.slice(0, 10).forEach((book) => {
      let coverbookImage = book.coverImage ? book.coverImage : defaultCoverUp;

      const rowEntry = document.createElement('tr') as HTMLTableRowElement;

      const imgtd = document.createElement('td') as HTMLTableCellElement;
      const img = document.createElement('img') as HTMLImageElement;
      img.alt = book.bookName;
      img.setAttribute('data-src', coverbookImage);
      img.classList.add('lazy-img');
      img.style.width = '50px';
      img.style.height = '50px';
      img.style.objectFit = 'contain';
      imgtd.appendChild(img);
      rowEntry.appendChild(imgtd);

      const genretd = document.createElement('td') as HTMLTableCellElement;
      genretd.innerHTML = book.genre;
      rowEntry.appendChild(genretd);

      const pricetd = document.createElement('td') as HTMLTableCellElement;
      pricetd.innerHTML = `$ ${book.price}`;
      rowEntry.appendChild(pricetd);

      const authorTd = document.createElement('td') as HTMLTableCellElement;
      authorTd.innerHTML = book.author;
      rowEntry.appendChild(authorTd);

      const publicyearTd = document.createElement('td') as HTMLTableCellElement;
      publicyearTd.innerHTML = book.publicationYear as string;
      rowEntry.appendChild(publicyearTd);

      const bookNameTd = document.createElement('td') as HTMLTableCellElement;
      bookNameTd.innerHTML = book.bookName;
      rowEntry.appendChild(bookNameTd);

      similarTable.appendChild(rowEntry);
  });

  lazyLoadImages();
}
/**
Handler: DOMContentLoaded event
Functionality: Calls the `lazyLoadImages` function once the initial HTML document has been completely loaded and parsed. This ensures that any images with lazy-loading attributes are processed as soon as the DOM is ready.
*/
document.addEventListener('DOMContentLoaded', function() {
    lazyLoadImages();
});

/**
 * Updates the UI with details of a specific book from the filtered data.
 * If no filtered data is available, it displays 'No Data Found' in the corresponding fields.
 * If filtered data exists, the function selects a book based on the filter conditions (price range) 
 * and updates the book ID, price, genre, author, publication year, and cover image.
 * Additionally, it hides or displays similar books based on the filter results.
 * Calls `similarBooksDetails` to display the details of similar books.
 */ 
function examinedBookDeatils(filterDatarr:Book[]):void {
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

/** get FilteredFunctions will return 3 function getExactMatches,getStartsWithMatches and includesMatches.
*/
function getFilterFunctions(val: string | number, currentData: Book[]) {
  const lowerVal = typeof val === 'string' ? val.toLowerCase() : val;

  function getExactMatches(key: keyof Book):Book[] {
    return currentData.filter((book) => {
      return typeof book[key] === 'string' && book[key].toLowerCase() === lowerVal})
  };

  function getStartsWithMatches(key: keyof Book):Book[] {
    return currentData.filter((book) => {
      return typeof book[key] === 'string' && book[key].toLowerCase().startsWith(lowerVal as string)})
  };

  function includesMatches(key: keyof Book):Book[] {
    return currentData.filter((book) => {
      return typeof book[key] === 'string' && book[key].toLowerCase().includes(lowerVal as string)})
  };

  return { getExactMatches, getStartsWithMatches, includesMatches };
}
/** 
Filters the provided book data based on the given filter type and value.
Utilizes different matching strategies (exact, starts with, includes) based on the filter type.
*/
function filterData(val: string | number, filterType: string, currentData: Book[]): Book[] {
  const { getExactMatches, getStartsWithMatches, includesMatches } = getFilterFunctions(val, currentData);

  if (filterType === 'bookId') {
      const exactMatches = getExactMatches('bookId');
      if (exactMatches.length > 0) {
          return exactMatches;
      }
      const startsWithMatches = getStartsWithMatches('bookId');
      if (startsWithMatches.length > 0) {
          return startsWithMatches;
      }
      const includesMatchesData = includesMatches('bookId');
      if (includesMatchesData.length > 0) {
          return includesMatchesData;
      }
  }
  else if (filterType === 'genre') {
      const exactMatches = getExactMatches('genre');
      if (exactMatches.length > 0) {
          return exactMatches;
      }
      const startsWithMatches = getStartsWithMatches('genre');
      if (startsWithMatches.length > 0) {
          return startsWithMatches;
      }
  }
  else if (filterType === 'priceMin') {
      let priceMin = currentData.filter((book) => book.price >= (val as number));
      return priceMin;
  }
  else if (filterType === 'priceMax') {
      let priceMax = currentData.filter((book) => book.price <= (val as number));
      return priceMax;
  }
  else if (filterType === 'author') {
      const exactMatches = getExactMatches('author');
      if (exactMatches.length > 0) {
          return exactMatches;
      }
      const startsWithMatches = getStartsWithMatches('author');
      if (startsWithMatches.length > 0) {
          return startsWithMatches;
      }
      const includesMatchesData = includesMatches('author');
      if (includesMatchesData.length > 0) {
          return includesMatchesData;
      }
  }
  else if (filterType === 'publicationYear') {
      let publicationYear = currentData.filter((book) => book.publicationYear.toString() === val);
      return publicationYear;
  }
  return [];
}

/**
 * Handles the book search functionality by applying multiple filters (book ID, genre, price range, author, and publication year).
 * Filters the `total_book_arr` based on user inputs, and sorts the filtered data by price if any filters are applied.
 * If filters are present, it displays similar books and passes the filtered data to `examinedBookDetails`.
 * If no filters are applied, it clears the displayed results.
 */
function handleSearch():void {
    let filteredData:Book[] = total_book_arr;
  
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

/**
 * Returns a subset of book data for the given page number based on the pagination settings.
 */
function paginateData(page:number):Book[] {
    const start:number=(page-1)*rowsPage;
    const end:number=start+rowsPage;
    return total_book_arr.slice(start, end);
};

/**
 * Renders the pagination component dynamically based on the total number of pages.
 * Highlights the current page and allows navigation by clicking on page numbers or 'Prev'/'Next'.
 * Re-renders the book table when a page is selected.
 */
function renderPagination(totalPages:number):void {
    const paginationElement = document.querySelector('.pagination') as HTMLUListElement;
    paginationElement.innerHTML = '';

    function createPageItem(page:number, text:string|number){
      const li = document.createElement('li');
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

/**
 * Renders a table of book data with pagination.
 * Creates rows dynamically with book details (image, name, price, genre, year, author).
 * Utilizes lazy loading for book images and updates pagination based on the total data.
 */
function allbooks(): void {
    const bookstable = document.querySelector('#table-all-books tbody') as HTMLElement;
    bookstable.innerHTML = '';

    const tableData = paginateData(currentPage);
    tableData.forEach((ele) => {
      let bookImage: string;
      if (ele.coverImage) {
        bookImage = ele.coverImage;
      }
      else {
        bookImage = defaultCoverUp;
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
    const totalPages = Math.ceil(total_book_arr.length / rowsPage);
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
   
/**
 * Fetches book data from localStorage if available, otherwise retrieves it from an API.
 * Stores the fetched API data in localStorage and handles errors.
 */
function dataBook():Promise<Book[] | null> {
  const localData=localStorage.getItem('Data');
  if(localData){
    const data=JSON.parse(localData);
    total_book_arr=data;
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
        total_book_arr=ele;
        return ele;
    })
    .catch((err)=>{
        console.error("Error in fetching Book Data",err);
        return null;
    });
}

// Calling the dataBook function to fetch book data, either from localStorage or an API.
dataBook().then((ele: Book[] | null) => {
  console.log("Data from LocalStorage:", ele);
})
// After retrieving the data, this calls the allbooks function to perform further actions with the book data.
.then(allbooks);