import React, { useEffect, useRef, useCallback  } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchPeople } from '../actions/peopleActions'
import { fetchStarships } from '../actions/starshipActions'
import { Link } from 'react-router-dom'
import yoda from '../Images/Yoda.png' 
/** @jsx jsx */
import { jsx } from '@emotion/core'

// need an if statement if url is null dont fetch
// style


const CharacterList = () => {

    const people = useSelector(state => state.people.people)
    const loading = useSelector(state => state.people.loading)
    const url = useSelector(state => state.people.url)
    const starships = useSelector(state => state.starships.starships)
    const dispatch = useDispatch()
    const observer = useRef()
    
    const lastNameRow = useCallback(node => {
        if(loading)return
        if(observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && url ){
                dispatch(fetchPeople())
            }
        })
        if (node) observer.current.observe(node)
    },[loading, url, dispatch])


    useEffect(() => {
        if(url === null){
            return
        }
        dispatch(fetchPeople())
        dispatch(fetchStarships())
    }, [dispatch]);
    let x = -1
    
    return (
        <div>
            <h1 id='title'>Star Wars Characters</h1>
            <table id='characters'>
                <tbody>
                    <tr>
                        <th key={2} >NAME</th>
                        <th key={3} >BIRTH YEAR</th>
                        <th key={4} >HEIGHT</th>
                        <th key={5} >MASS</th>
                    </tr>
                    
                    { starships.length > 0 && people.length > 0 ? people.map((person, i = 0)=> {
        if(i!== 0 && (i + 1) % 8 === 1){
            x++
            const { name } = starships[x]
            return (
                <tr key ={i}>
                    <td>{i + 1}</td>
                    <td>
                    <Link to={{
                    pathname: `/viewspaceship/${name}`,
                    state: {
                        spaceshipData: starships[x]
                    }
                }}>
                        {name}
                    </Link>
                </td>
                </tr>
            )
        }
        if(people.length === i + 1){
            const { name, birth_year, height, mass, url } = person
            return (
                <tr key={i} ref={lastNameRow}>
                <td>{i + 1}</td>
                <td>
                <Link to={{
                    pathname: `/viewdetials/${name}`,
                    state: {
                        characterData: person
                    }
                }}>
                {name}
                </Link>
                </td>
                <td>{birth_year}</td>
                <td>{height}</td>
                <td>{mass}</td>
            </tr>
            ) } else {
            const { name, birth_year, height, mass} = person
            return (
                <tr key={i}>
                <td>{i + 1}</td>
                <td>
                <Link to={{
                    pathname: `/viewdetials/${name}`,
                    state: {
                        characterData: person
                    }
                }}>
                {name}
                </Link>
                </td>
                <td>{birth_year}</td>
                <td>{height}</td>
                <td>{mass}</td>
            </tr>
            ) 

        }
    }) : null }
                </tbody>
            </table>
            {loading && <>
            <img src={yoda} alt='yoda' />
            <p>loading</p>
            </>}
        </div>
    )
}

export default CharacterList