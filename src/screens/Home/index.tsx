import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  Metadata,
  Title,
  TotalPassCount,
  LoginList,
} from './styles';

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
}

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchText, setSearchText] = useState('');
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    const dataKey = '@savepass:logins';
    const dataStorage = await AsyncStorage.getItem(dataKey);
    if (dataStorage) {
      const dataStorageParsed = JSON.parse(dataStorage);
      setData(dataStorageParsed);
      setSearchListData(dataStorageParsed);
    }
  }

  function handleFilterLoginData() {
    if (searchText) {
      const filteredData = data.filter((item) =>
        item.service_name.toLowerCase().includes(searchText.toLowerCase()),
      );
      setSearchListData([...filteredData]);
    } else {
      setSearchListData([...data]);
    }
  }

  function handleChangeInputText(text: string) {
    setSearchText(text);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  return (
    <>
      <Header
        user={{
          name: 'Thomaz',
          avatar_url: 'https://github.com/LMThomaz.png',
        }}
      />
      <Container>
        <SearchBar
          placeholder='Qual senha você procura?'
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType='search'
          onSubmitEditing={handleFilterLoginData}
          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${`${searchListData.length}`.padStart(2, '0')} ao total`
              : 'Nada a ser exibido'}
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => {
            return (
              <LoginDataItem
                service_name={loginData.service_name}
                email={loginData.email}
                password={loginData.password}
              />
            );
          }}
        />
      </Container>
    </>
  );
}
