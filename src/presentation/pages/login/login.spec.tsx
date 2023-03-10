import React from 'react'
import { render, RenderResult, fireEvent,cleanup } from '@testing-library/react'
import Login from './login'
import { Validation } from '@/presentation/protocols/validation'

type SutTypes = { 
    sut: RenderResult
    validationSpy: ValidationSpy
} 

class ValidationSpy implements Validation { 
    errorMessage: string
    input: object

    validate (input: object): string {
        this.input = input
        return this.errorMessage

    }
}


const makeSut = (): SutTypes => {
    const validationSpy = new ValidationSpy()
    const sut  = render(<Login validation={validationSpy} />)
    return {
        sut,  
        validationSpy
    }
}

describe('Login Component', () => {
    afterEach(cleanup)


    test('Should start with initial state', () =>{
        const { sut, validationSpy } = makeSut()
        const errorWrap = sut.getByTestId('error-wrap')
        expect(errorWrap.childElementCount).toBe(0)
        const submitButton = sut.getByTestId('submit') as HTMLButtonElement
        expect(submitButton.disabled).toBe(true)
        // const emailStatus = getByTestId('email-status')
        // expect(emailStatus.title).toBe('Campo obrigatório')
        // const passwordStatus = getByTestId('password-status')
        // expect(passwordStatus.title).toBe('Campo obrigatório')
    })
    test('Should call Validation with corret values', () =>{
        const { sut } = makeSut()
        const emailInput = sut.getByTestId('email')
        fireEvent.input(emailInput, { targert: { value: 'any_email' } })
        expect(validationSpy.input).toEqual({ 
            email: 'any_email'
        })
    })
    test('Should call Validation with corret password', () =>{
        const { sut } = makeSut()
        const passwordInput = sut.getByTestId('password')
        fireEvent.input(passwordInput, { targert: { value: 'any_password' } })
        expect(validationSpy.input).toEqual({
            password: 'any_password'
        })
    })
})