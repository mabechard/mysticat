package com.multitiers.repository;

import java.util.ArrayList;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.multitiers.domaine.entity.Card;

public interface CardRepository extends JpaRepository<Card, String> {
	Card findByCardId(String cardId);
	Card findByCardName(String cardName);
	Set<Card> findCardsByManaCost(int manaCost);
	ArrayList<Card> findAll();
}
