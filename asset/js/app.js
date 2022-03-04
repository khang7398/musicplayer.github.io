const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const progress = $('#progress')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const cd = $('.cd')
const nextbtn = $('.btn-next')
const prevbtn = $('.btn-prev')
const randombtn = $('.btn-random')
const repeatbtn = $('.btn-repeat')
const playlist = $('.playlist')

const app ={
    currentIndex: 0,
    isRandom: false,
    isPlaying: false,
    isRepaet: false,
    songs: [
        {
            name : 'Vì tôi còn sống',
            Singer: 'Tiên Tiên',
            path: './asset/music/music1.mp3',
            image: './asset/img/song1.jpg'
        },
        {
            name : 'Cưới thôi',
            Singer: 'Masew',
            path: './asset/music/music2.mp3',
            image: './asset/img/song2.jpg'
        },
        {
            name : 'Độ Tộc 2',
            Singer: 'Phúc Du, Pháo, Masew, Độ Mixi',
            path: './asset/music/music3.mp3',
            image: './asset/img/song3.jpg'
        }, {
            name : 'Ái Nộ',
            Singer: 'Masew',
            path: './asset/music/music4.mp3',
            image: './asset/img/song4.jpg'
        }
    ],

    render: function(){
        const htmls = this.songs.map(function(song, index){
            return`
              <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index="${index}">
                  <div class="thumb" style="background-image: url('${song.image}')"></div>
                  <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.Singer}</p>
                  </div>
                  <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                  </div>
              </div>
          `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        
        const _this = this
        //xứ lý cho phần cd-thumb quay
         const cdThumbAnimation = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimation.pause()

        //xử lý phóng to / thu nhỏ
        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            
            cd.style.opacity = newCdWidth / cdWidth
        }

        //xử lý khi nhấn play
       
        playBtn.onclick = function(){
            if(_this.isPlaying){ 
                audio.pause() 
            }else{
                audio.play()  
            }
        }
        // khi bài hát được play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimation.play()
        }
        // khi song bị pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimation.pause()
        }
        //khi tiến độ bài hát thay đổi
        
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        //xứ lý khi  tua bài hát
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
       // next bài hát
       nextbtn.onclick = function(){
           if(_this.isRandom){
               _this.Randomsong()
           }else{
               _this.songNext()
           }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

       }
       // prev bài hát
       prevbtn.onclick= function(){
        if(_this.isRandom){
            _this.Randomsong()
        }else{
            _this.songPrev()
        }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

       }
       // random bài hát
       randombtn.onclick = function(){
           _this.isRandom = !_this.isRandom
           randombtn.classList.toggle('active', _this.isRandom)
       }
       // xử lý next song khi bài hát hết
       audio.onended = function(){
            if(_this.isRepaet){
                audio.play()
            }else{
                if(_this.isRandom){
                    _this.Randomsong()
                }else{
                    _this.songNext()
                }
            }
            audio.play()
       }
       //xử lý lặp lại một bài hát
       repeatbtn.onclick = function(){
           _this.isRepaet = !_this.isRepaet
           repeatbtn.classList.toggle('active', _this.isRepaet)
       }

       //lắng nghe hành vi khi lick vào playlist
       playlist.onclick = function(e){
           const songNode = e.target.closest('.song:not(.active)')
           if(songNode || e.target.closest('.option')){
                _this.currentIndex = Number(songNode.getAttribute('data-index'))
                _this.loadCurrentSong()
                _this.render()
                audio.play()
           }
       }
    },
    loadCurrentSong: function(){
    
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    scrollToActiveSong: function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            })
        })
    },

    songNext: function(){
        this.currentIndex ++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    songPrev: function(){
        this.currentIndex --
        if(this.currentIndex <0 ){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },
    Randomsong: function(){
        let newIndex 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function(){
        //định nghịa các thuộc tính cho object
        this.defineProperties()

        //làng nghe / xử lý các sự kiện
        this.handleEvents()

        //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        //render playlist
        this.render()

       
    }
}

app.start()

