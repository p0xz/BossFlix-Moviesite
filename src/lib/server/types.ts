export namespace Movies {
    export interface Root {
        result: Result[]
        pages: number
    }

    export interface Result {
        imdb_id: string
        tmdb_id: string
        title: string
        embed_url: string
        embed_url_tmdb: string
        quality: string
    }

}

export namespace imdbSearch {
    export interface Root {
        d: D[]
        q: string
        v: number
    }

    export interface D {
        i: I
        id: string
        l: string
        q: string
        qid: string
        rank: number
        s: string
        v?: V[]
        vt?: number
        y: number
        yr?: string
    }

    export interface I {
        height: number
        imageUrl: string
        width: number
    }

    export interface V {
        i: I2
        id: string
        l: string
        s: string
    }

    export interface I2 {
        height: number
        imageUrl: string
        width: number
    }

}

export namespace imdbSeries {
    export namespace _Raw {

        export interface Root {
            data: Data
            extensions: Extensions
        }

        export interface Data {
            title: Title
        }

        export interface Title {
            primaryImage: PrimaryImage
            episodes: Episodes
        }

        export interface PrimaryImage {
            url: string
        }

        export interface Episodes {
            seasons: Season[]
            episodes: Episodes2
        }

        export interface Season {
            number: number
        }

        export interface Episodes2 {
            pageInfo: PageInfo
            edges: Edge[]
        }

        export interface PageInfo {
            hasNextPage: boolean
            endCursor: string
        }

        export interface Edge {
            node: Node
        }

        export interface Node {
            id: string
            titleText: TitleText
            series: Series
        }

        export interface TitleText {
            text: string
        }

        export interface Series {
            episodeNumber: EpisodeNumber
        }

        export interface EpisodeNumber {
            seasonNumber: number
            episodeNumber: number
        }

        export interface Extensions {
            disclaimer: string
            experimentalFields: ExperimentalFields
        }

        export interface ExperimentalFields {
            janet: any[]
        }
    }

    export interface Root {
        seasons: Season[]
        episodes: Episodes
    }

    export interface Season {
        number: number
    }

    export interface Episodes {
        pageInfo: PageInfo
        edges: Record<string, Edge[]>
    }

    export interface PageInfo {
        hasNextPage: boolean
        endCursor: string
    }

    export interface Edge {
        node: Node
    }

    export interface Node {
        id: string
        titleText: TitleText
        series: Series
    }

    export interface TitleText {
        text: string
    }

    export interface Series {
        episodeNumber: EpisodeNumber
    }

    export interface EpisodeNumber {
        seasonNumber: number
        episodeNumber: number
    }

}