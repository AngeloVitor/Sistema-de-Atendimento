import React, { useState } from 'react'
import io from 'socket.io-client'

import Container from '../../components/Container'
import Button from '../../components/Button'

import * as S from './styles'

const socket = io('http://localhost:8080', { transports: ['websocket'] })
socket.on('connect', () => console.log('[SOCKET] [USER] => New Connection'))

const PasswordTerminal = () => {
  const [currentPassword, setCurrentPassword] = useState()
  const [thanksButton, setThanksButton] = useState(false)

  const selectPassword = category => {
    socket.emit('password.send', category)
    setThanksButton(true)
  }

  socket.on('object.passwords', data => {
    const allPasswords = data['all']
    setCurrentPassword(allPasswords[allPasswords.length - 1])
  })

  const showText = () => {
    return (
      thanksButton && (
        <S.CurrentPassword>
          Sua Senha: <span>{currentPassword}</span>
        </S.CurrentPassword>
      )
    )
  }

  const showPassword = () => {
    return (
      <>
        <S.WrapperButtons>
          {thanksButton ? (
            <Button onClick={() => setThanksButton(false)}>Voltar</Button>
          ) : (
            <>
              <Button onClick={() => selectPassword('normal')}>Normal</Button>
              <Button onClick={() => selectPassword('Prioridade')}>
                Prioridade
              </Button>
            </>
          )}
        </S.WrapperButtons>
        {showText()}
      </>
    )
  }

  return (
    <Container>
      <S.Wrapper>
        <h1>Por Favor Selecione Seu Tipo de Senha!</h1>
        {showPassword()}
      </S.Wrapper>
    </Container>
  )
}

export default PasswordTerminal
