package com.example.subway.service;

import com.example.subway.dto.MemberDto;
import com.example.subway.entity.MemberEntity;
import com.example.subway.repository.MemberRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    // 회원가입
    public boolean signUp(MemberDto memberDTO) {
        // 중복 아이디 확인
        if (memberRepository.findByMemberEmail(memberDTO.getMemberEmail()).isPresent()) {
            return false; // 아이디가 이미 존재함
        }

        // dto -> entity 변환
        MemberEntity memberEntity = MemberEntity.toMemberEntity(memberDTO);

        memberEntity.setMemberPassword(memberDTO.getMemberPassword());
        memberRepository.save(memberEntity);

        // save
        memberRepository.save(memberEntity);
        return true; // 회원가입 성공
    }

    // 로그인
    public MemberDto login(MemberDto memberDTO) {
        /*
            1. 사용자가 입력한 이메일이 DB에 있는지 조회
            2. 있다면 비밀번호가 일치하는지 판단
         */
        Optional<MemberEntity> byMemberEmail = memberRepository.findByMemberEmail(memberDTO.getMemberEmail());
        if (byMemberEmail.isPresent()) {
            // 조회 결과가 있다.
            MemberEntity memberEntity = byMemberEmail.get();
            if(memberEntity.getMemberPassword().equals(memberDTO.getMemberPassword())) {
                // 비밀번호 일치
                MemberDto dto = MemberDto.toMemberDTO(memberEntity);
                return dto;
            } else {
                // 비밀번호 불일치
                return null;
            }
        } else {
            // 조회 결과가 없다.
            return null;
        }
    }

    public MemberEntity getMemberFromSession(HttpSession session) {
        String memberEmail = (String) session.getAttribute("memberEmail");
        if (memberEmail == null) {
            return null;
        }
        return findByMemberEmail(memberEmail);
    }

    public List<MemberDto> findAll() {
        List<MemberEntity> memberEntityList = memberRepository.findAll();
        List<MemberDto> memberDtoList = new ArrayList<>();
        for (MemberEntity memberEntity : memberEntityList) {
            memberDtoList.add(MemberDto.toMemberDTO(memberEntity));
        }
        return memberDtoList;
    }

    public MemberDto findById(Long id) {
        Optional<MemberEntity> optionalMemberEntity = memberRepository.findById(id);
        if (optionalMemberEntity.isPresent()) {
            return MemberDto.toMemberDTO(optionalMemberEntity.get());
        } else {
            return null;
        }
    }

    public MemberEntity findByMemberEmail(String memberEmail) {
        Optional<MemberEntity> optionalMemberEntity = memberRepository.findByMemberEmail(memberEmail);
        return optionalMemberEntity.orElse(null);
    }
}
