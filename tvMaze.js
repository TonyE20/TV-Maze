"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(show) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=<${show}>`)

  let shows = []
  for (let show of res.data){

    let obj = {
        id : show.show.id, 
        name : show.show.name, 
        summary: show.show.summary, 
        image: show.show.image ? show.show.image : 'https://tinyurl.com/tv-missing'
    }
    // console.log(obj.id)
    shows.push(obj)
  }
    return shows;  
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
            <div class="media">
                <img 
                src="${show.image.medium}" 
                alt="${show.name}" 
                class="w-25 mr-3">
                    <div class="media-body">
                        <h5 class="text-primary">${show.name}</h5>
                        <div><small>${show.summary}</small></div>
                        <button class="btn btn-primary get-episodes">Episodes</button>
                    </div>
            </div>  
        </div>
    `);   
     $showsList.append($show);  
    } 
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { 
    const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
    return res.data.map(val => {
        let obj = {};
        obj.id = val.id;
        obj.name = val.name;
        obj.season = val.season;
        obj.number = val.number;
        return obj;
    }) 
}


/** Write a clear docstring for this function... */
function populateEpisodes(episodes) { 
    $('#episodes-list').empty()
    for (let episode of episodes){
        let name = episode.name;
        let season = episode.season;
        let number = episode.number;
        let $ul = $('#episodes-list');
        let $li = $(`<li>${name} (season: ${season}, number: ${number})</li>`);
        $ul.append($li);
        $episodesArea.show()
    }    
}

$showsList.on('click', ".get-episodes", async function list(e){
    
    let $id = $(e.target).closest('.Show').data('showId')
    let episodes = await getEpisodesOfShow($id);
    populateEpisodes(episodes);
});
