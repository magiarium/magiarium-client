'use client';
import { createContext, ReactNode, useState } from 'react';
import { SideAssistant } from '../components/SideAssistant';
import { SideAssistantController } from '../libs/SideAssistantController';

const SideAssistantContext = createContext<SideAssistantController | null>(
  null
);

const SideAssistantContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [sideAssistantController] = useState(
    () =>
      new SideAssistantController({
        speechContext: (
          <>
            <p>ようこそ、『まぎありうむ』へ。</p>
          </>
        ),
      })
  );

  return (
    <SideAssistantContext.Provider value={sideAssistantController}>
      {children}
      <SideAssistant />
    </SideAssistantContext.Provider>
  );
};

export { SideAssistantContext, SideAssistantContextProvider };
