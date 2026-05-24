package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "github.com/gocolly/colly"
)

func main() {
    http.HandleFunc("/search", func(w http.ResponseWriter, r *http.Request) {
        q := r.URL.Query().Get("q")
        if q == "" {
            http.Error(w, "?q é obrigatório", 400)
            return
        }

        c := colly.NewCollector()
        var results []map[string]string

        c.OnHTML(".last_episode a, .img a", func(e *colly.HTMLElement) {
            results = append(results, map[string]string{
                "title": e.Attr("title"),
                "link":  e.Attr("href"),
            })
        })

        c.Visit("https://gogoanime.cl/search.html?keyword=" + q)
        json.NewEncoder(w).Encode(results)
    })

    http.ListenAndServe(":" + os.Getenv("PORT"), nil)
}
