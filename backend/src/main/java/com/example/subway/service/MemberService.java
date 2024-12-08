package com.example.subway.service;

import com.example.subway.dto.LoginDto;
import com.example.subway.dto.SignUpDto;
import com.example.subway.entity.MemberEntity;
import com.example.subway.repository.MemberRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    // 회원가입
    public boolean signUp(SignUpDto signUpDto) {
        // 중복 아이디 확인
        if (memberRepository.findByMemberEmail(signUpDto.getMemberEmail()).isPresent()) {
            return false; // 아이디가 이미 존재함
        }

        // dto -> entity 변환
        MemberEntity memberEntity = MemberEntity.toMemberEntity(signUpDto);

        // save
        memberRepository.save(memberEntity);
        return true; // 회원가입 성공
    }

    // 로그인
    public boolean login(LoginDto loginDTO) {
        Optional<MemberEntity> byMemberEmail = memberRepository.findByMemberEmail(loginDTO.getMemberEmail());
        if (byMemberEmail.isPresent()) {
            // 조회 결과가 있다.
            MemberEntity memberEntity = byMemberEmail.get();
            // 비밀번호 일치
            if(memberEntity.getMemberPassword().equals(loginDTO.getMemberPassword())) {
                return true;
            } else {
                // 비밀번호 불일치
                return false;
            }
        } else {
            // 조회 결과가 없다.
            return false;
        }
    }

    public MemberEntity getMemberFromSession(HttpSession session) {
        String memberEmail = (String) session.getAttribute("memberEmail");
        return findByMemberEmail(memberEmail);
    }

    public MemberEntity findByMemberEmail(String memberEmail) {
        Optional<MemberEntity> optionalMemberEntity = memberRepository.findByMemberEmail(memberEmail);
        return optionalMemberEntity.orElse(null);
    }
}
