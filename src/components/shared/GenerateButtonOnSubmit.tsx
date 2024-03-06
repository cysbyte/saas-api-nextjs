import React, { FC } from 'react'
import {  useFormStatus } from 'react-dom'
import PricingPlanButton from './PricingPlanButton'

type Props = {
    text: string
}

const GenerateButton:FC<Props> = (props) => {

  return (
    <div className="w-full mt-4">
          <PricingPlanButton
              text={props.text}
              isScale={false} />
      </div>
  )
}

export default GenerateButton